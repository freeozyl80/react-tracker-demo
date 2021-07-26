import { collectTargets } from './intersectionObserver'

const observerOptions = {
  childList: true, // 观察目标子节点的变化，是否有添加或者删除
  attributes: true, // 观察属性变动
  subtree: true, // 观察后代节点，默认为 false
}

function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    // console.log(mutation.type, mutation)
    switch (mutation.type) {
      case 'childList':
        collectTargets()
        break
      case 'attributes':
        /* mutation.target 中某节点的一个属性值被更改；该属性名称在 mutation.attributeName 中，
           该属性之前的值为 mutation.oldValue */
        // console.log('attributes', mutation)
        break
    }
  })
}

const mutationObserver = new MutationObserver(callback)

mutationObserver.observe(document, observerOptions)

export default mutationObserver
