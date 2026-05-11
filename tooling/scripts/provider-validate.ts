import { apimartAdapter } from '../../packages/provider-apimart/src/index';
import { laozhangAdapter } from '../../packages/provider-laozhang/src/index';

const providerArg = process.argv.find((arg) => arg.startsWith('--provider='));
const provider = providerArg?.split('=')[1] || 'laozhang';

const adapter = provider === 'apimart' ? apimartAdapter : laozhangAdapter;

adapter
  .validate()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
