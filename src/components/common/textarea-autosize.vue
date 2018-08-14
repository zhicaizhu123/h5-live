<style lang="scss" scoped>
.textarea {
  max-height: 1.6rem;
  padding: .15rem .13rem;
  outline: 0;
  border: none;
  font-size: .3rem;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-user-modify: read-write-plaintext-only;
  -webkit-user-select: text;
  background-color: #fff;
  border-radius: .06rem;
  border: 1px solid #e4e7e9;
  &:empty:before{
    content:attr(placeholder);
    font-size: .3rem;
    color: #afbdcc;
  }
  &:focus:before{
    content:none;
  }
  p {
    margin: 0;
  }
}
</style>

<template>
  <div
    class="textarea"
    placeholder="请在这里输入内容"
    contenteditable="true">
  </div>
</template>
<script>
export default {
  name: 'TextareaAutosize',
  mounted() {
    this.addInputEvent()
    this.addFocusEvent()
    this.addEventPaste(this.$el)
  },
  methods: {
    /**
    * 监听鼠标input事件
    */
    addInputEvent() {
      this.$el.addEventListener('input', () => {
        this.$emit('input', this.getValue())
      })
    },
    /**
    * 监听鼠标获取焦点事件
    */
    addFocusEvent() {
      this.$el.addEventListener('focus', () => {
        setTimeout(() => {
          // 解决：如果ios手机使用的不是原生键盘（也可能不止IOS手机有这个问题），则会出现键盘挡住输入框问题，当bottom=0的情况，使用这个属性就可以滚动屏幕中央
          this.$el.scrollIntoView(true)
        }, 300)
        this.$emit('focus')
      })
    },

    appendValue(value) {
      this.$el.innerText += value
      this.$emit('input', this.getValue())
    },
    /**
    * 监听复制事件，去除样式得到纯文本
    */
    addEventPaste(el) {
      try {
        document.execCommand('AutoUrlDetect', false, false)
      } catch (e) {
        console.log(e)
      }
      // 监听复制paste事件，目的是为了让-webkit-user-modify属性兼容IE8，毕竟该属性在IE兼容性不好
      el.addEventListener('paste', (e) => {
        e.preventDefault()
        let text = null
        if (window.clipboardData && window.clipboardData.setData) {
          // IE
          text = window.clipboardData.getData('text')
        } else {
          text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本')
        }
        // 这里的目的是为了将鼠标的光标移动到复制之后文本的末尾的末尾
        if (document.body.createTextRange) {
          let textRange
          let sel
          if (document.selection) {
            textRange = document.selection.createRange()
          } else if (window.getSelection) {
            sel = window.getSelection()
            const range = sel.getRangeAt(0)
            // 创建临时元素，使得TextRange可以移动到正确的位置
            const tempEl = document.createElement('span')
            tempEl.innerHTML = '&#FEFF;'
            range.deleteContents()
            range.insertNode(tempEl)
            textRange = document.body.createTextRange()
            textRange.moveToElementText(tempEl)
            tempEl.parentNode.removeChild(tempEl)
          }
          textRange.text = text
          textRange.collapse(false)
          textRange.select()
        } else {
          // Chrome之类浏览器
          document.execCommand('insertText', false, text)
        }
      })
    },

    setValue(value) {
      this.$el.innerText = value
      this.$emit('input', this.getValue())
    },

    getValue() {
      return this.getHtmlToText()
    },

    getHtmlToText() {
      return this.replaceToBreak(this.getHtml())
    },

    getHtml() {
      return document.querySelector('.textarea').innerHTML
    },

    replaceToBreak(html) {
      let content = ''
      content = String(html).replace(/<\/div>/gi, '')
      content = html.replace(/<div>(<br>)?(<br\/>)?/gi, '\n')
      content = html.replace(/<br>|<br\/>/gi, '\n')
      return content
    },

    getText() {
      if (window.navigator.appName.indexOf('Explorer') > -1) { return this.$el.innerText }
      return this.$el.textContent
    },
  },
}
</script>
