import { defineComponent, ref } from 'vue'
import { VOverlay, VProgressCircular } from 'vuetify/components'

export const LoadingOverlayInjectKey = 'LoadingOverlayInjectKey'

export interface LoadingOverlyApiInjection {
  show: () => void
  hide: () => void
}

export default defineComponent({
  name: 'LoadingOverlyProvider',
  setup() {
    const model = ref(false)
    const api: LoadingOverlyApiInjection
      = {
        show: () => {
          model.value = true
        },
        hide: () => {
          model.value = false
        },
      }
    provide(LoadingOverlayInjectKey, api)
    return {
      model,
    }
  },
  render() {
    return (
      <>
        {this.$slots.default?.()}
        <VOverlay
          v-model={this.model}
          class={['align-center', 'justify-center']}
        >
          <VProgressCircular
            color="primary"
            indeterminate
            size="64"
          ></VProgressCircular>
        </VOverlay>
      </>
    )
  },
})

export function useLoadingOverlay(): LoadingOverlyApiInjection {
  const api = inject(LoadingOverlayInjectKey, null)
  if (api === null)
    throw new Error('not outer <loading-overlay-provider> found')

  return api
}
