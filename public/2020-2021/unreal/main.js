import '../promo-table.js'
import { drawTable, loadData, saveData, noteSwitch } from '../promo-table.js'

// (await import('../initData.js')).initData(`Nom;Né(e) le;Sexe;E-mail;Heures manquées;;Entrée;Sortie
// ;;;;Toutes;Mes cours;;
// "CHEVALIER Jason";"27/06/1999";"M";"jason.chevalier@supdecreation.com";"90h00 (3)";"00h00";"Début d'année";""
// "COHEN Kelly";"25/02/2001";"F";"kelly.cohen@supdecreation.com";"";"-";"Début d'année";""
// "FIGUEIREDO Jean-Vianney";"04/01/2001";"M";"jeanvianney.figueiredo@supdecreation.com";"30h00 (1)";"00h00";"Début d'année";""
// "FRANCOIS Mathias";"05/04/2000";"M";"mathias.francois@supdecreation.com";"405h00 (16)";"15h00 (1)";"Début d'année";""
// "GILLY Eric";"10/11/1999";"M";"eric.gilly@supdecreation.com";"120h00 (5)";"00h00";"Début d'année";""
// "KOCKEROLS Gwendal";"20/07/1999";"M";"gwendal.kockerols@supdecreation.com";"30h00 (1)";"00h00";"Début d'année";""
// "MARTINEZ Damien";"22/10/1999";"M";"damien.martinez@supdecreation.com";"165h00 (6)";"00h00";"Début d'année";""
// "MARZAIS Nicolas";"18/08/2000";"M";"nicolas.marzais@supdecreation.com";"480h00 (19)";"00h00";"Début d'année";""
// "PERRAUD Yohan";"14/10/2001";"M";"yohan.perraud@supdecreation.com";"105h00 (4)";"30h00 (1)";"Début d'année";""
// "QUINIOU Erwann";"19/02/2001";"M";"erwann.quiniou@supdecreation.com";"240h00 (10)";"120h00 (5)";"Début d'année";""
// "RAPINE Léa";"03/09/2001";"F";"lea.rapine@supdecreation.com";"";"-";"Début d'année";""
// "RAYMOND Arthur";"24/02/1996";"M";"arthur.raymond@supdecreation.com";"315h00 (12)";"00h00";"Début d'année";""
// "WYNANDS Nathan";"20/06/2002";"M";"nathan.wynands@supdecreation.com";"30h00 (1)";"30h00 (1)";"Début d'année";""
// `)

const data = await loadData()

const select = document.querySelector('select')
select.selectedIndex = /0/.test(window.location.hash) ? 0 : 1
select.onchange = () => {
  window.location.hash = select.selectedIndex
  window.location.reload()
}

const evaluationIndex = select.selectedIndex
const getEval = student => student.evaluations[evaluationIndex]

const firstColumns = [
{
  title: 'Nom',
  cls: 'name first',
  value: s => s.firstname,
}, 
{
  title: 'Prénom',
  cls: 'name last',
  value: s => s.lastname,
}]

drawTable(data.students, [...firstColumns, 
  evaluationIndex === 1 && {
    title: 'lien',
    cls: 'link',
    editable: true,
    value: s => `<a href="${s.link}">${getEval(s).link}</a>`,
  },
  {
    title: 'commentaire',
    cls: 'comment',
    editable: true,
    value: s => getEval(s).comment,
    onValueChange: (s, value) => getEval(s).comment = value,
  },
  evaluationIndex === 1 && {
    title: 'extra commentaire',
    cls: 'extra-comment',
    editable: true,
    value: s => getEval(s).extraComment,
    onValueChange: (s, value) => getEval(s).extraComment = value,
  },
  {
    title: 'note',
    cls: 'note note-abc',
    editable: true,
    value: s => getEval(s).note,
    onValueChange: (s, value) => getEval(s).note = value,
  },
  {
    title: '/20',
    cls: 'note note-20',
    value: s => noteSwitch(getEval(s).note),
  }
], {
  transformRow: (s, row) => {
    const { extraComment, note } = s.evaluations[evaluationIndex]
    row.classList.toggle('has-extra-comment', !!extraComment)
    row.classList.toggle('has-note-z', /^z$/i.test(note))
  },
})

document.querySelector('button#yaml-save').onclick = async () => {
  saveData(data)
}
