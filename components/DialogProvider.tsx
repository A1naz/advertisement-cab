import type { VNodeChild } from 'vue'
import { defineComponent, provide, reactive, ref } from 'vue'
import { createId } from 'seemly'
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VDialog, VSpacer } from 'vuetify/components'
import { render } from '@/utils/vue/render'

interface ContentType {
  title?: string
  cancelText?: string
  persistent?: boolean
  confirmText?: string
  confirmColor?: string
  main: string | (() => VNodeChild)
  cancel?: () => void
  confirm?: () => void
}

export const DialogInjectKey = 'DialogInjectKey '

export interface DialogReactive {
  key: string
  content: ContentType
  _modelValue: boolean
  _onClose: (key: string) => void
  close: () => void
  confirmLoading: (loading: boolean) => void
  _confirmLoading: boolean
}

export interface DialogApiInjection {
  show: (content: ContentType) => DialogReactive
  closeAll: () => void
}

export default defineComponent({
  name: 'DialogProvider',
  setup() {
    const dialogListRef = ref<DialogReactive[]>([])
    const dialogRefs = ref<Record<string, DialogReactive>>({})

    const api: DialogApiInjection = {
      show(content: ContentType): DialogReactive {
        return create(content)
      },
      closeAll() {
        dialogListRef.value = []
        dialogRefs.value = {}
      },
    }
    provide(DialogInjectKey, api)

    function create(content: ContentType): DialogReactive {
      const dialogReactive = reactive<DialogReactive>({
        key: createId(),
        content: {
          persistent: true,
          ...content,
        },
        _modelValue: true,
        _confirmLoading: false,
        _onClose: (key: string) => {
          dialogListRef.value.splice(
            dialogListRef.value.findIndex(message => message.key === key),
            1,
          )
          delete dialogRefs.value[key]
        },
        confirmLoading(loading) {
          this._confirmLoading = loading
        },
        close() {
          this._modelValue = false
          setTimeout(() => {
            this._onClose(this.key)
          }, 1200)
        },
      })
      dialogListRef.value.push(dialogReactive)
      return dialogReactive
    }

    return Object.assign(
      {
        dialogRefs,
        dialogList: dialogListRef,
      },
      api,
    )
  },
  render() {
    return (
      <>
        {this.$slots.default?.()}
        {this.dialogList.length > 0
          ? (
          <>
            {this.dialogList.map((msg: DialogReactive) => {
              return (
                <VDialog
                  ref={
                    ((inst: DialogReactive) => {
                      if (inst)
                        this.dialogRefs[msg.key] = inst
                    }) as () => void
                  }
                  v-model={msg._modelValue}
                  maxWidth={290}
                  persistent={!!msg.content.persistent}
                >
                  <VCard>
                    <VCardTitle class={'headline'}>
                      {msg.content.title}
                    </VCardTitle>
                    <VCardText>
                      {render(msg.content.main)}
                    </VCardText>
                    <VCardActions>
                      <VSpacer></VSpacer>
                      <VBtn {...{
                        onClick: () => {
                          msg.close()
                          msg.content.cancel?.()
                        },
                      }} >{msg.content.cancelText}</VBtn>
                      <VBtn loading={msg._confirmLoading} color={msg.content?.confirmColor ?? 'error'}{...{
                        onClick: () => {
                          msg.content.confirm ? msg.content.confirm() : msg.close()
                        },
                      }} >{msg.content.confirmText }</VBtn>
                    </VCardActions>
                  </VCard>

                </VDialog>
              )
            })}
          </>
            )
          : null}
      </>
    )
  },
})

export function useDialog(): DialogApiInjection {
  const api = inject(DialogInjectKey, null)
  if (api === null)
    throw new Error('not outer <snackbar-provider> found')

  return api
}
