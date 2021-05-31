/**
 * 
 * @param {HTMLElement} table 
 */
export const initHover = (table) => {

  const hoverDiv = document.createElement('div')
  hoverDiv.classList.add('hover-options')
  hoverDiv.innerHTML = `Copy`
  hoverDiv.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopImmediatePropagation()

    navigator.clipboard.writeText(hoverTarget.innerText)
  })

  let hoverTarget = undefined
  const setHover = (div) => {
    hoverDiv.style.left = `${div.offsetLeft}px`
    hoverDiv.style.top = `${div.parentElement.offsetTop}px`
    hoverTarget = div
  }

  table.append(hoverDiv)

  const divs = table.querySelectorAll(':scope > div:not(.header) > div')
  for (const div of divs) {
    div.addEventListener('pointerover', (e) => setHover(e.currentTarget))
  }
}