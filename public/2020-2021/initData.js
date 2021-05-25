// Nom;Né(e) le;Sexe;E-mail;Heures manquées;;Entrée;Sortie
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

export const initData = async (csv) => {

  const students = csv.split('\n')
    .slice(2)
    .map(v => v.trim())
    .filter(v => !!v)
    .map(v => v.split(/;/))
    .map(array => array.map(v => v.slice(1, -1)))
    .map(array => {
      const [
        names,
        birthday,
        gender,
        email,
      ] = array
      const [first, last] = names.split(/\s+/)
      return {
        names: [first, last].join(','),
        birthday,
        gender,
        email,
        link: '',
        comment: '',
        note: '',
        extraComment: '',
      }
    })

  const yaml = await import('../lib/js-yaml.js')
  const text = yaml.dump({ students })
  const response = await fetch('data.yaml', {
    method: 'POST',
    body: text,
  })
  console.log(await response.text())
}