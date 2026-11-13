import type { CaseStudy } from '../types';
import exploit from './exploit.webp';
import exploitStill from './exploit-still.webp';

export const evaluatorStressTest: CaseStudy = {
  id: 'evaluator-stress-test',
  kind: 'case-study',
  title: 'Evaluator Stress Test for Reward Functions',
  tagline: 'Finding broken reward functions before you train on them.',
  image: exploit,
  imageStill: exploitStill,
  imageAlt:
    'A simulated Shadow Hand holding a block under adversarial physics. The block never reaches the target orientation shown beside it, while the reward function pays out at maximum on every step.',
  imageCaption: 'overfit_stability · ρ 0.001 · reward 1.000 · success 0/100',
  // Measured off the rendered frames: the goal block's horizontal centre, and
  // its highest top edge across the whole clip so the callout never collides.
  imageAnnotation: {
    text: 'TARGET ORIENTATION',
    emphasis: 'NEVER REACHED',
    x: 86.1,
    y: 25.5,
  },
  status: 'built',
  order: 1,
  longDescription: [
    "An RL agent does not learn the goal you have in mind. It learns to maximize whatever number you hand it. When those two come apart the agent finds the gap and sits in it, and the reward function that caused it looks completely reasonable when you read it. The real problem is when you find out. A reward only ever gets tested by training on it, so a bad one costs you the whole run before it tells you anything. That matters more now that systems like EUREKA have language models writing rewards in bulk, because the bottleneck moves from writing them to deciding which ones are worth the compute.",
    "So I wanted to know whether you can tell a reward is broken without training on it. The way in is to stop treating the reward as the thing being optimized and treat it as the thing under attack. If a reward can be gamed then some situation exists where it pays out while the task is failing, and you don't need a policy to go looking for it. What you attack is the environment, because physics is where the assumptions hide. A reward that quietly depends on gravity being 9.81 looks identical to a robust one until gravity changes.",
    "The parameters depend on the environment. I validated EST (Evaluator Stress Test) on the MuJoCo Shadow Hand block rotation task, where that meant four of them: gravity, friction, mass and joint damping. EST scales each one away from its normal value and searches for a setting where the reward goes high while the environment's own success flag stays at zero. That is a cheating state. The search is Bayesian optimization rather than random sampling, because it builds a model of where the reward is weak as it goes and spends the rest of its budget there. Rewards sit on completely different scales, so EST first runs each one under normal physics to see what it pays when nothing is wrong, then scores the worst cheat it found against that baseline. What comes out is a Robustness Score between 0 and 1.",
    "I ran it against eight reward functions written to span the range from unhackable to trivially gamed, and it got both ends right. The binary sparse reward scored 1.0 because no cheating state exists for it, and both rewards I built to be broken scored near zero.",
    "It also caught one I had not planted. A reward I designed to be robust was calibrated against a threshold the environment's starting distribution already sat above, so it paid out before the task made any progress. You can't see that by reading the function.",
    "The cost argument is the one that matters. EST ranked all eight in about 110 seconds. Training PPO on the same eight took about 72 minutes, roughly 40 times longer, and it agreed with EST. The rewards EST scored least robust were the ones PPO earned the most on, because it found the same holes (Spearman ρ = −0.857, p = 0.007). That agreement is about which rewards are exploitable, not which ones produce better agents. Shadow Hand needs millions of steps before task success shows up at all and my budget was 200,000, so that test is still open. The middle of the range also did not separate cleanly, which I would put on giving the search only 20 iterations.",
  ],
  highlights: [
    'Scored the unhackable sparse reward at 1.0 and both deliberately broken rewards near zero.',
    'Caught a reward function I had written to be robust. Its threshold sat inside the range the environment already starts in, so it paid out before the task made any progress, and reading the function would never have shown it.',
    'Runs before training instead of after it, so a bad reward costs seconds of search instead of a full training run.',
  ],
  cardHighlight:
    'Ranked eight reward functions in about 110 seconds, 40 times faster than training PPO on them, and flagged the same rewards PPO went on to exploit.',
  technologies: ['Python', 'MuJoCo', 'Gymnasium', 'scikit-optimize', 'Stable-Baselines3'],
};
