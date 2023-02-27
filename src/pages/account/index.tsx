import Alert from '@/components/Alert'
import Button from '@/components/Button'
import { Input } from '@/components/Input'
import { AddOutlined } from '@/icons/AddOutlined'
import { DeleteFilled } from '@/icons/DeleteFilled'
import { Account } from '@/types'
import { createSignal, onMount } from 'solid-js'
import { invoke } from '@tauri-apps/api/tauri';

function AccountManage() {
  const [errMsg, setErrMsg] = createSignal<string | null>(null)
  const [accounts, setAccounts] = createSignal<Account[]>([{ phone: '', remark: '' }])

  function addAccount() {
    setErrMsg(null)
    setAccounts((acc) => [...acc, { phone: '', remark: '' }])
  }

  function updateAccount(index: number, key: keyof Account, value: string) {
    setErrMsg(null)
    const clone = [...accounts()]
    setAccounts(() => {
      clone[index][key] = value
      return clone
    })
  }

  function removeAccount(index: number) {
    if (accounts().length === 1) {
      setErrMsg('最少需要一个账号')
    } else {
      setErrMsg(null)
      setAccounts((acc) => {
        const clone = [...acc]
        clone.splice(index, 1)
        return clone
      })
    }
  }

  async function save(e: MouseEvent) {
    e.preventDefault()
    const errors: string[] = []
    for (const [index, account] of accounts().entries()) {
      if (!account.phone) {
        errors.push(`账号${index + 1}未提供手机号`)
      } else if (!account.phone.match(/^1\d{10}$/)) {
        errors.push(`账号${index + 1}手机号不正确`)
      }
    }
    if (errors.length) {
      setErrMsg((msg) => (msg = errors.join('\n')))
    } else {
      await invoke('save_accounts', { data: accounts })
    }
  }

  onMount(async () => {
    const accounts = await invoke<Account[]>('get_accounts')
    if (accounts.length) {
      setAccounts(() => accounts)
    }
  })

  return (
    <div class="flex flex-col pt-6 items-center">
      <form class="w-full px-4">
        <h2 class="text-center mb-4">JD账号管理</h2>
        <div class="flex mb-4 justify-end">
          <Button onClick={addAccount}>
            <AddOutlined />
            <span>添加</span>
          </Button>
        </div>
        {errMsg() && <Alert class="mb-4" text={errMsg()!} />}
        {accounts().map((account, index) => (
          <>
            <p class="text-xs mb-3">账号{index + 1}: </p>
            <div class="flex space-x-2 pb-4 items-center">
              <Input
                value={account.phone}
                label="手机号"
                required
                maxLength={11}
                name={`${index}.phone`}
                placeholder="请输入手机号"
                onBlur={(e) => updateAccount(index, 'phone', e.currentTarget.value)}
              />
              <Input
                value={account.remark}
                label="备注"
                name={`${index}.remark`}
                maxLength={10}
                placeholder="请输入账号备注"
                onBlur={(e) => updateAccount(index, 'remark', e.currentTarget.value)}
              />
              <DeleteFilled class="text-[24px]" onClick={() => removeAccount(index)} />
            </div>
          </>
        ))}

        <div class="mt-8 mb-4 px-12">
          <Button type="submit" class="!w-full" onClick={save}>
            保存
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AccountManage
