/* eslint-disable no-console */
export const log = {
  info: (msg: string) => console.log(msg),
  ok: (msg: string) => console.log(`✅ ${msg}`),
  step: (msg: string) => console.log(`🔧 ${msg}`),
  link: (msg: string) => console.log(`🔗 ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
};
