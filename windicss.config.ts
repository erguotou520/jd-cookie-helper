import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      transformOrigin: {
        "0": "0%",
      },
      zIndex: {
        "-1": "-1",
      },
    },
  }
})