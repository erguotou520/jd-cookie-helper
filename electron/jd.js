var evt1 = new Event('input', {
  bubbles: true,
  cancelable: true
})
var ie=document.querySelector('.acc-input.mobile')
ie.value = '$$1'
ie.dispatchEvent(evt1)

var evt2 = new Event('change', {
  bubbles: false,
  cancelable: true
})
var ce = document.querySelector('.policy_tip-checkbox')
ce.checked = true
ce.dispatchEvent(evt2)

setTimeout(function() {{
  document.querySelector('.getMsg-btn').click()
}}, 1000)