import { ProviderEngine } from './ProviderEngine';
import { VixSrcProvider } from './providers/VixSrc';
import { WcoTvProvider } from './providers/WcoTv';

// Initialize the global provider engine
export const engine = new ProviderEngine();

// Register plugins
engine.registerProvider(VixSrcProvider);
engine.registerProvider(WcoTvProvider);

// Export for usage in the UI
export default engine;
