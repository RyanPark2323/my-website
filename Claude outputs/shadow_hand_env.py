"""
est/env/shadow_hand_env.py

Shadow Hand environment wrapper with perturbable physics.

    ┌───────────────────────────────────────────────────────────────────┐
    │ RECONSTRUCTED FILE — not part of the original EST project.        │
    │                                                                   │
    │ The original est/env/shadow_hand_env.py was never committed: the  │
    │ repository's .gitignore carries an unanchored `env/` rule meant   │
    │ for virtualenvs, which also matched this package directory. The   │
    │ file is lost. This module was rebuilt from the interface its four │
    │ callers require (est/search/objective.py, scripts/run_est.py,     │
    │ scripts/smoke_test.py, scripts/render_exploit.py) so the pipeline │
    │ runs again. Behaviour matches the documented contract; it is not  │
    │ guaranteed to match the original line for line.                   │
    └───────────────────────────────────────────────────────────────────┘

What this provides:
    - A MuJoCo Shadow Hand block-rotation environment (gymnasium-robotics).
    - set_physics() / reset_physics(), the perturbation hooks EST's
      adversarial search drives.
    - run_episode(), which rolls out a controller and scores each transition
      with a candidate reward function.

Perturbation model. EST searches a four-dimensional space of multiplicative
scale factors applied to the *nominal* model values captured at construction:

    gravity_scale   → model.opt.gravity
    friction_scale  → model.geom_friction
    mass_scale      → model.body_mass
    damping_scale   → model.dof_damping

Scales are always applied to the stored nominal snapshot rather than to the
current values, so repeated set_physics() calls do not compound — the
optimizer evaluates hundreds of configurations against one shared env.

These are MjModel fields, not MjData, so they survive env.reset() and stay in
force for every episode until reset_physics() restores them.
"""

from __future__ import annotations

import numpy as np

import gymnasium
import gymnasium_robotics

gymnasium.register_envs(gymnasium_robotics)


#: The task EST is validated on. Binary `is_success` in info, independent of
#: every candidate reward, is what makes a "cheating state" well defined.
ENV_ID = "HandManipulateBlockRotateXYZ-v1"

#: The four perturbation dimensions, in the order the BO search declares them.
PARAM_KEYS = ("gravity_scale", "friction_scale", "mass_scale", "damping_scale")


class ShadowHandEnv:
    """
    Shadow Hand block rotation with a perturbable physics model.

    Args:
        render_mode: None for headless rollouts, "rgb_array" to capture frames.
        max_episode_steps: TimeLimit for the underlying env.
        seed: optional reset seed. Left unset by default — the adversarial
              search wants independent episodes, not repeats of one.
    """

    def __init__(
        self,
        render_mode: str | None = None,
        max_episode_steps: int = 100,
        seed: int | None = None,
        width: int | None = None,
        height: int | None = None,
        camera_config: dict | None = None,
    ):
        # width/height only affect the offscreen framebuffer, never the
        # physics — raising them for a publication render changes nothing
        # the search or the rewards can see.
        size_kwargs = {}
        if width is not None:
            size_kwargs["width"] = width
        if height is not None:
            size_kwargs["height"] = height
        if camera_config is not None:
            size_kwargs["default_camera_config"] = camera_config

        self.env = gymnasium.make(
            ENV_ID,
            render_mode=render_mode,
            max_episode_steps=max_episode_steps,
            **size_kwargs,
        )
        self.max_episode_steps = max_episode_steps
        self.seed = seed

        model = self.env.unwrapped.model
        # The nominal snapshot every perturbation is applied against.
        self._nominal = {
            "gravity": np.array(model.opt.gravity, dtype=np.float64).copy(),
            "geom_friction": np.array(model.geom_friction, dtype=np.float64).copy(),
            "body_mass": np.array(model.body_mass, dtype=np.float64).copy(),
            "dof_damping": np.array(model.dof_damping, dtype=np.float64).copy(),
        }
        self._current_params: dict | None = None

    # ------------------------------------------------------------------
    # Physics perturbation
    # ------------------------------------------------------------------

    @property
    def model(self):
        return self.env.unwrapped.model

    @property
    def current_physics(self) -> dict | None:
        """The perturbation currently in force, or None under nominal physics."""
        return self._current_params

    def reset_physics(self) -> None:
        """Restore every perturbed field to the nominal snapshot."""
        model = self.model
        model.opt.gravity[:] = self._nominal["gravity"]
        model.geom_friction[:] = self._nominal["geom_friction"]
        model.body_mass[:] = self._nominal["body_mass"]
        model.dof_damping[:] = self._nominal["dof_damping"]
        self._current_params = None

    def set_physics(self, physics_params: dict) -> None:
        """
        Apply one perturbation configuration.

        Missing keys default to 1.0, so a partial dict is a valid partial
        perturbation. Scaling is relative to the nominal snapshot, never to
        whatever was set last.
        """
        self.reset_physics()

        gravity = float(physics_params.get("gravity_scale", 1.0))
        friction = float(physics_params.get("friction_scale", 1.0))
        mass = float(physics_params.get("mass_scale", 1.0))
        damping = float(physics_params.get("damping_scale", 1.0))

        model = self.model
        model.opt.gravity[:] = self._nominal["gravity"] * gravity
        model.geom_friction[:] = self._nominal["geom_friction"] * friction
        # Mass is scaled without recomputing body inertia — the perturbation is
        # a coarse dynamics change, not a physically consistent re-modelling.
        model.body_mass[:] = self._nominal["body_mass"] * mass
        model.dof_damping[:] = self._nominal["dof_damping"] * damping

        self._current_params = dict(physics_params)

    # ------------------------------------------------------------------
    # Rollouts
    # ------------------------------------------------------------------

    def run_episode(
        self,
        controller,
        reward_fn=None,
        max_steps: int | None = None,
    ) -> list[dict]:
        """
        Roll out one episode and score every transition.

        Returns a list of per-step dicts:
            step           int
            custom_reward  float | None   candidate reward for the transition
            env_reward     float          the environment's own reward
            success        bool           info["is_success"]
            unstable       bool           step raised, or produced NaN/Inf

        A step that goes numerically unstable is recorded with
        custom_reward 0.0 and unstable True rather than raising: the
        adversarial search drives physics into regimes where the simulator
        does fall over, and one bad configuration should cost an evaluation,
        not the whole run. objective.py skips these steps when scoring.
        """
        steps = self.max_episode_steps if max_steps is None else max_steps

        reset_kwargs = {} if self.seed is None else {"seed": self.seed}
        obs, _info = self.env.reset(**reset_kwargs)

        low = self.env.action_space.low
        high = self.env.action_space.high

        trajectory: list[dict] = []

        for t in range(steps):
            action = np.clip(np.asarray(controller(obs, t), dtype=np.float64), low, high)

            try:
                next_obs, env_reward, terminated, truncated, info = self.env.step(action)
            except Exception:
                trajectory.append(
                    {
                        "step": t,
                        "custom_reward": 0.0,
                        "env_reward": 0.0,
                        "success": False,
                        "unstable": True,
                    }
                )
                break

            unstable = not np.all(np.isfinite(next_obs["observation"]))

            custom_reward = None
            if reward_fn is not None:
                try:
                    value = float(reward_fn(obs, action, next_obs, info))
                    custom_reward = value if np.isfinite(value) else 0.0
                except Exception:
                    custom_reward = 0.0
                    unstable = True

            if unstable:
                custom_reward = 0.0

            trajectory.append(
                {
                    "step": t,
                    "custom_reward": custom_reward,
                    "env_reward": float(env_reward),
                    "success": bool(info.get("is_success", False)),
                    "unstable": bool(unstable),
                }
            )

            obs = next_obs
            if terminated or truncated or unstable:
                break

        return trajectory

    # ------------------------------------------------------------------

    def close(self) -> None:
        self.env.close()

    def __repr__(self) -> str:
        state = self._current_params or "nominal"
        return f"ShadowHandEnv({ENV_ID!r}, physics={state})"
