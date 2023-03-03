if (window.confirm('点击确定复制cookie并关闭窗口，取消仅复制')) {
  navigator.clipboard.writeText('$$1')
  window.close()
} else {
  navigator.clipboard.writeText('$$1')
}