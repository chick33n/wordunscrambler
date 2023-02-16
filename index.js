const {promises: fs} = require("fs");
const { get } = require("http");
const { userInfo } = require("os");
const path = require('path')
const { getHeapSnapshot } = require("v8");
const express = require('express')
const app = express();
const bodyParser = require ('body-parser');


app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}))

var list; 

var music1 = requrire('music1.mp3')
var music2 = requrire('music2.mp3')
var music3 = requrire('music3.mp3')
var music4 = requrire('music4.mp3')


async function getList(){
  try {
      const content = await fs.readFile('./wordlist.txt',  'utf-8')
      const list = content.split(/\r?\n/);
      
      return list; 
  } catch (error) {
      console.log(error)
  }
}


app.get('/', async (req, res) => {
  list = await getList();
  res.render('index.ejs')
})

app.get('/answers:letters', (req, res) => {

  var allletters = req.query.letters;
  var letters = [];
  for(i = 0; i < 6 ; i++){
    letters[i] = allletters[i];
  }

    var words = [];
    var useableWords = []; 
    function generateWords(letters, word) {
    if (word.length >= 3) {
    words.push(word);
    for(i=0; i<=list.length;i++){
        if(list[i] == word.toUpperCase()){
            useableWords.push(word);
        }
    }
  }
  for (var i = 0; i < letters.length; i++) {
    var newLetters = letters.slice(0, i).concat(letters.slice(i + 1));
    generateWords(newLetters, word + letters[i]);
  }
}
generateWords(letters, '')

  var goodWords = [];

  goodWords = useableWords.sort(function(a, b){
    return b.length - a.length;
  })

  //console.log(goodWords)
  res.render('answers.ejs',{goodWords:goodWords, music1:music1,music2:music2,music3:music3,music4:music4})
})



app.use(express.static("public"))

const port = 8080;
app.listen(process.env.PORT || port, ()=>{
    console.log(`Listining at http://localhost:${port}`);
});

module.exports = app