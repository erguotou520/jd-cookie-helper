import Alert from '@/components/Alert'
import Button from '@/components/Button'
import { Input } from '@/components/Input'
import { AddOutlined } from '@/icons/AddOutlined'
import { DeleteFilled } from '@/icons/DeleteFilled'
import { GithubOutlined } from '@/icons/GithubOutlined'
import { OpenNewOutlined } from '@/icons/OpenNewOutlined'
import { Account } from '@/types'
import { createSignal, onMount } from 'solid-js'

function AccountManage() {
  const [showLike, setShowLike] = createSignal(false)
  const [isEdit, setIsEdit] = createSignal(false)
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
      if (await window.__ipc__.invoke('saveAccounts', { accounts: accounts() })) {
        setIsEdit(() => false)
      }
    }
  }

  function openJD(index: number) {
    window.__ipc__.invoke('openJD', { accounts: [accounts()[index]] })
  }

  function openAll() {
    window.__ipc__.invoke('openJD', { accounts: accounts() })
  }

  onMount(async () => {
    const _accounts = (await window.__ipc__.invoke('getAccounts')) as Account[]
    if (_accounts.length) {
      setAccounts(() => _accounts)
      setIsEdit(() => false)
    } else {
      setIsEdit(() => true)
    }
  })

  return (
    <div class="flex flex-col min-h-screen items-center">
      <form class="w-full px-4 pb-10">
        <h2 class="my-4 text-center">JD账号管理</h2>
        <div class="flex mb-6 justify-end">
          {isEdit() ? (
            <Button onClick={addAccount}>
              <AddOutlined />
              <span>添加</span>
            </Button>
          ) : (
            <Button onClick={() => setIsEdit(() => true)}>
              <AddOutlined />
              <span>编辑</span>
            </Button>
          )}
        </div>
        {errMsg() && <Alert class="mb-4" text={errMsg()!} />}
        {accounts().map((account, index) => (
          <>
            <div class="flex space-x-2 pb-5 items-center">
              <p class="w-8">{index + 1}</p>
              <Input
                value={account.phone}
                label="手机号"
                required
                readonly={!isEdit()}
                tabIndex={1}
                maxLength={11}
                name={`${index}.phone`}
                placeholder="请输入手机号"
                onBlur={(e) => updateAccount(index, 'phone', e.currentTarget.value)}
              />
              <Input
                value={account.remark}
                label="备注"
                readonly={!isEdit()}
                tabIndex={1}
                name={`${index}.remark`}
                maxLength={10}
                placeholder="请输入账号备注"
                onBlur={(e) => updateAccount(index, 'remark', e.currentTarget.value)}
              />
              {isEdit() ? (
                <DeleteFilled class="transform text-2xl translate-y-1" onClick={() => removeAccount(index)} />
              ) : (
                <OpenNewOutlined class="transform text-2xl translate-y-1" onClick={() => openJD(index)} />
              )}
            </div>
          </>
        ))}

        <div class="mt-8 mb-4 px-12">
          {isEdit() ? (
            <Button type="submit" class="!w-full" onClick={save}>
              保存
            </Button>
          ) : (
            <Button class="!w-full" onClick={openAll}>
              全部打开
            </Button>
          )}
        </div>
      </form>
      <div class="text-sm text-center w-full py-2 bottom-8 left-0 fixed">
        {showLike() && (
          <>
            <div
              class="bg-opacity-40 bg-dark-500 top-0 right-0 bottom-0 left-0 z-10 fixed"
              onClick={() => setShowLike(() => false)}
            />
            <div class="bg-white rounded flex shadow m-4 p-4 z-100 relative">
              <img src="/wepay.png" class="w-36" />
              <div class="h-full mx-auto bg-gray-300 w-1px"></div>
              <img src="/alipay.png" class="w-36" />
            </div>
          </>
        )}
        <span class="cursor-pointer text-gray-600 hover:text-emerald-500" onClick={() => setShowLike((val) => !val)}>
          软件做的不错，打赏安排！🍗
        </span>
        <GithubOutlined class='cursor-pointer text-lg top-2 right-4 text-gray-600 absolute hover:text-emerald-500' onClick={() => window.openGithubPage()} />
      </div>
    </div>
  )
}

export default AccountManage
