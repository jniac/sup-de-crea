import yaml from '../lib/js-yaml.js'
import html from '../src/html.js'
import { windowLoad } from '../src/utils.js'


const loadData = async () => yaml.load(await (await fetch('./data.yaml')).text())

const noteTable = (note) => {
  note = String(note).toLowerCase()
  switch(note) {
    case 'a+': return '20'
    case 'a': return '17'
    case 'b': return '14'
    case 'c': return '11'
    case 'z': return '0'
    default: return '...'
  }
}

const update = (data) => {

  const mainElement = document.querySelector('main')
  const editable = window.location.href.includes('localhost')
  
  for (const student of data.students) {
    const { email, names, link, comment, note, extraComment } = student
    const [firstname, lastname] = names.split(/\s*,\s*/)
    const div = html/* html */`
      <div class="student row" data-email="${email}">
        <div contenteditable="${editable}" class="name">${firstname}</div>
        <div contenteditable="${editable && !link}" class="link"><a href="${link}">${link}</a></div>
        <div contenteditable="${editable}" class="comment">${comment.replace('\n', '<br>')}</div>
        <div contenteditable="${editable}" class="extra-comment">${extraComment}</div>
        <div contenteditable="${editable}" class="note-abc">${note}</div>
        <div contenteditable="${editable}" class="note-20">${noteTable(note)}/20</div>
      </div>
    `
    div.classList.toggle('has-extra-comment', !!extraComment)
    mainElement.append(div)
  }
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


const main = async () => {

  const data = await loadData()
  await windowLoad()

  update(data)

  const getStudentByEmail = (email) => data.students.find(student => student.email === email)

  document.querySelector('button#yaml').onclick = () => {

    for (const div of document.querySelectorAll('.student')) {
      const { email } = div.dataset
      const student = getStudentByEmail(email)
      student.link = div.querySelector('.link').innerText
      student.comment = div.querySelector('.comment').innerText
      student.extraComment = div.querySelector('.extra-comment').innerText
      student.note = div.querySelector('.note-abc').innerText
    }

    const text = yaml.dump(data)
    downloadString(text, 'text/yaml', 'data.yaml')
  }
}

main()
