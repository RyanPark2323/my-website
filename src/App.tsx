import { ColonyProvider } from './colony/ColonyProvider';
import Foyer from './foyer/Foyer';

/**
 * The colony is mounted here, above everything that can change, and is never
 * unmounted. Anything route-like belongs INSIDE ColonyProvider — putting the
 * provider inside a page component would restart the colony on navigation,
 * which is the one thing it must never do.
 */
function App() {
  return (
    <ColonyProvider>
      <Foyer />
    </ColonyProvider>
  );
}

export default App;
