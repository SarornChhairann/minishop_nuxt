export default defineEventHandler(() => {
  return {
    status: 'ok',
    message: 'Pong!',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    preset: process.env.NITRO_PRESET
  }
})
