import yaml from '../lib/js-yaml.js'
import html from '../src/html.js'
import { windowLoad } from '../src/utils.js'
import { initHover } from './promo-table-hover.js'

export const loadData = async (url = 'data.yaml') => {
  const data = yaml.load(await (await fetch(url)).text())
  assignFirstAndLastNames(data)
  return data
}

export const saveData = async (data, url = 'data.yaml') => {
  const text = yaml.dump(data)
  const response = await fetch(url, {
    method: 'POST',
    body: text,
  })
  console.log(await response.text())
}

const assignFirstAndLastNames = (data) => {
  for (const student of data.students) {
    const [firstname, lastname] = student.names.split(/\s*,\s*/)
    Object.assign(student, { firstname, lastname })
  }
}

const deleteFirstAndLastNames = (data) => {
  for (const student of data.students) {
    delete student.firstname
    delete student.lastname
  }
}

export const noteSwitch = (note) => {
  note = String(note).toLowerCase()
  switch(note) {
    case 'a+': return '20'
    case 'a': return '17'
    case 'b': return '14'
    case 'c': return '11'
    case 'z': return '5'
    default: return '...'
  }
}

export const drawTable = (students, columns, {
  transformRow = (_, row) => row,
}) => {
  const tableElement = document.querySelector('.promo-table')
  const headers = html`
    <div class="student row header">
      ${columns.map(column => (
        `<div class="${column.cls}">${column.title}</div>`
      )).join('\n')}
    </div>
  `
  tableElement.append(headers)

  for (const student of students) {
    const { email } = student
    const row = html/* html */`
      <div class="student row" data-email="${email}">
        ${columns.map(column => {
          const value = column.value(student)
          return (
            `<div class="${column.cls}">${value}</div>`
          )
        }).join('\n')}
      </div>
    `
    tableElement.append(transformRow(student, row) || row)
  }
}

const buildTable = (data) => {

  const mainElement = document.querySelector('main')
  const editable = window.location.href.includes('localhost')

  const header = html/* html */`
    <div class="student row header">
      <div class="sort-button name last">Nom</div>
      <div class="sort-button name first">Prénom</div>
      <div class="link">projet github</div>
      <div class="comment">commentaire</div>
      <div class="extra-comment"></div>
      <div class="sort-button note note-abc">note ABC</div>
      <div class="note note-20">/20</div>
    </div>
  `
  mainElement.append(header)
  
  const header2 = html/* html */`
    <div class="student row header copy">
      <div class="sort-button name last">
        <button>copy</button>
      </div>
      <div class="sort-button name first">
        <button>copy</button>
      </div>
      <div class="link">
        <button>copy</button>
      </div>
      <div class="comment">
        <button>copy</button>
      </div>
      <div class="extra-comment">
        <button>copy</button>        
      </div>
      <div class="sort-button note note-abc">
        <button>copy</button>
      </div>
      <div class="note note-20">
        <button>copy</button>        
      </div>
    </div>
  `
  header2.addEventListener('click', (e) => {
    if (/button/i.test(e.target.tagName)) {
      const node = e.target.parentElement
      const nodeIndex = [...node.parentElement.children].indexOf(node)
      const rows = [...document.querySelectorAll('.promo-table > .row')].slice(2)
      const str = 
        rows.map(row => row.children[nodeIndex].innerText)
        // .map(str => str.replace('/20', ''))
        // .map(str => `"${str}"`)
        .join('\n')

      navigator.clipboard.writeText(str)
    }
  })
  mainElement.append(header2)
  
  for (const student of data.students) {
    const { email, firstname, lastname, link, comment, note, extraComment } = student
    const div = html/* html */`
      <div class="student row" data-email="${email}">
        <div contenteditable="${false}" class="name last">${lastname}</div>
        <div contenteditable="${false}" class="name first">${firstname}</div>
        <div contenteditable="${editable && !link}" class="link"><a href="${link}">${link}</a></div>
        <div contenteditable="${editable}" class="comment">${comment.replace('\n', '<br>')}</div>
        <div contenteditable="${editable}" class="extra-comment">${extraComment}</div>
        <div contenteditable="${editable}" class="note note-abc">${note}</div>
        <div contenteditable="${editable}" class="note note-20">${noteSwitch(note)}</div>
      </div>
    `
    div.classList.toggle('has-extra-comment', !!extraComment)
    div.classList.toggle('has-note-z', /^z$/i.test(note))
    mainElement.append(div)
  }

  initHover(mainElement)
}

const downloadString =  (text, fileType, fileName) => {
  const blob = new Blob([text], { type: fileType })

  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(function() { URL.revokeObjectURL(a.href) }, 1500)
}


export const initTable = async () => {

  const data = await loadData()
  await windowLoad()

  buildTable(data)

  const getStudentByEmail = (email) => data.students.find(student => student.email === email)

  const updateData = () => {
    for (const div of document.querySelectorAll('.student:not(.header)')) {
      const { email } = div.dataset
      const student = getStudentByEmail(email)
      const extract = (cls) => div.querySelector(cls).innerText
      Object.assign(student, {
        link: extract('.link'),
        comment: extract('.comment'),
        extraComment: extract('.extra-comment'),
        note: extract('.note-abc'),
      })
    }
  }

  document.querySelector('button#yaml-download').onclick = () => {
    updateData()
    const text = yaml.dump(data)
    downloadString(text, 'text/yaml', 'data.yaml')
  }

  document.querySelector('button#yaml-save').onclick = async () => {
    updateData()
    deleteFirstAndLastNames(data)
    
    const text = yaml.dump(data)
    const response = await fetch('data.yaml', {
      method: 'POST',
      body: text,
    })
    console.log(await response.text())
    
    if (response.status === 200) {
      setTimeout(() => {
        window.location.reload()
      }, 400)
    }
  }
}
