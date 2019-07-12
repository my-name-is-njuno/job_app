var mysql = require('mysql');
var req = require('request')
var cher = require('cheerio')
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var expressHandler = require('express-handlebars')
var expressValidator = require('express-validator')
var session = require('express-session')
var flash = require('connect-flash')
var multer = require('multer') 


// upload directory
var upload = multer({dest: './public/images'});


// routes
var routes = require('./routes/index')
// var admin = require('./routes/admin')


// init app
var app = express();


// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// handle session
app.use(session({
  secret:'secret',
  saveUnitialized:true,
  resave:true
}))



// validator middleware
app.use(expressValidator({
    errorFormatter:function(param, msg, value) {
      var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root
    
    while(namespace.length) {
      formParam+= '['+namespace.shift()+']'
    }
    return {
      param:formParam,
      msg: msg,
      value: value
    }
  }
}))


// pulci folder
app.use(express.static(path.join(__dirname, 'public')))


// view engines
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', expressHandler({defaultLayout:'main'}))
app.set('view engine', 'handlebars')


// connect flash
app.use(flash())


// other settings
app.use('/', routes)
// app.use('/admin', admin)

// port
app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function() {
  console.log('Server running on port: '+app.get('port'))
})



 






var con = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "",
  database : 'nodejobs',

})



// find getEmails

function getEmails(page) {
  var search_in = page;
  string_context = search_in.toString();
  array_mails = string_context.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  return array_mails;
}


function chunkArray(myArray, chunk_size) {
  var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}








function add_elems_to_jubilee_array(arr){
  let fna = []
  for(let i = 0; i < arr.length; i++) {
    let arrr = arr[i].concat([
      'Recruitment@jubileekenya.com',
      'Jubilee Insurance Ltd',
      'https://jubileeinsurance.com/ke/',
      'https://jubileeinsurance.com/ke/jubilee-careers/',
    ])
    fna.push(arrr)
  }

  return fna;
}



function add_elems_to_ga_array(arr){
  let fna = []
  for(let i = 0; i < arr.length; i++) {
    let arrr = arr[i].concat([
      'careers@gakenya.com',
      'GA Insurance Limited',
      'https://www.gakenya.com/',
      'https://www.gakenya.com/ga-insurance-limited/working-at-ga/careers/',
    ])
    fna.push(arrr)
  }

  return fna;
}







function add_elems_to_ken_array(arr){
  let fna = []
  for(let i = 0; i < arr.length; i++) {
    let arrr = arr[i].concat([
      'recruitment@kenindia.com',
      'Kenindia Insurance Ltd',
      'https://www.kenindia.com/careers/',
      'https://www.kenindia.com/careers/',
    ])
    fna.push(arrr)
  }

  return fna;
}






function add_elems_to_her_array(arr){
  let fna = []
  for(let i = 0; i < arr.length; i++) {
    let arrr = arr[i].concat([
      'vacancies@heritage.co.ke',
      'Heritage Insurance Company Ltd',
      'https://www.heritageinsurance.co.ke/content/careers',
      'https://www.heritageinsurance.co.ke/content/careers',
    ])
    fna.push(arrr)
  }

  return fna;
}







function add_elems_to_jb_array(arr, ml, cp, ws, lk){
  let fna = []
  for(let i = 0; i < arr.length; i++) {
    let arrr = arr[i].concat([
      ml,cp,ws,lk,
    ])
    fna.push(arrr)
  }

  return fna;
}







const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};













 

con.connect(function(err) {
  if(err) console.log(err);
  console.log("Connected to Database")









  // get jobs from jubilee website
let strath_job_array = []
  req('https://www.strathmore.edu/vacancies/', (err, res, html) => {
      if(!err && res.statusCode == 200) {
        const $ = cher.load(html);
        $('.vc_tta-panel-title').map((jb,elm)=>{
          var title = $(elm).find('.vc_tta-title-text').text().trim().replace(/,/, ' ')
          // console.log(title)
          strath_job_array.push(title)
          var ref = 'strathmore'
          // console.log(ref)
          strath_job_array.push(ref)
          var dtc = new Date()
          // console.log(dtc)
          strath_job_array.push(dtc)
        }) 
        var result = chunkArray(strath_job_array, 3)
        var final_results = add_elems_to_jb_array(result, 'recruitment@strathmore.edu', 'Strathmore University', 'https://www.strathmore.edu/', 'https://www.strathmore.edu/vacancies/')
        // console.log(final_results)
        let sql=""
        for(let i = 0; i<final_results.length; i++) {
          sql = "SELECT * FROM jobs WHERE ref = '"+final_results[i][1]+"' LIMIT 1";
          con.query(sql, function(error, rt) {
            if(rt.length == 0) {
              sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
              con.query(sql, [[ final_results[i] ]] , function(e, rtt) {
                if(!e) {;
                  // console.log("Inserted");
                } else {
                  // console.log(e);
                }
              })
            } else {
              // console.log("Exists");
            }
          })
        }
      }
    })
























 



















  // get jobs from daystar website
  let daystar_job_array = []
  req('https://www.daystar.ac.ke/vacancies.html', (err, res, html) => {
      if(!err && res.statusCode == 200) {
        const $ = cher.load(html);
        $('li > div > a').map((jb,elm)=>{
          var title = $(elm).find('.entry-content').text().trim().replace(/,/, ' ')
          // console.log(title)
          daystar_job_array.push(title)
          var ref = 'daystar'
          // console.log(ref)
          daystar_job_array.push(ref)
          var dtc = new Date()
          // console.log(dtc)
          daystar_job_array.push(dtc)
        }) 
        var result = chunkArray(daystar_job_array, 3)
        var final_results = add_elems_to_jb_array(result, 'recruitment@daystar.ac.ke', 'Daystar University', 'https://www.daystar.ac.ke', 'https://www.daystar.ac.ke/vacancies.html')
        console.log(final_results)
        let sql=""
        for(let i = 0; i<final_results.length; i++) {
          sql = "SELECT * FROM jobs WHERE ref = '"+final_results[i][1]+"' LIMIT 1";
          con.query(sql, function(error, rt) {
            if(rt.length == 0) {
              sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
              con.query(sql, [[ final_results[i] ]] , function(e, rtt) {
                if(!e) {;
                  // console.log("Inserted");
                } else {
                  // console.log(e);
                }
              })
            } else {
              // console.log("Exists");
            }
          })
        }
      }
    })


















































// get jobs from jubilee website
let job_array = []
  req('https://jubileeinsurance.com/ke/jubilee-careers/', (err, res, html) => {
      if(!err && res.statusCode == 200) {
        const $ = cher.load(html);
        $('.career-position').map((jb,elm)=>{
          var title = $(elm).find('button').text().trim().replace(/,/, ' ')
          // console.log(title)
          job_array.push(title)
          var refstr = $(elm).find('div.ref-number > span').text().trim()
          var strall = refstr.split('Closing')
          var refs = strall[0].split(" ")
          var ref = refs.pop()
          // console.log(ref)
          job_array.push(ref)
          var dtsc = strall[1].split('ate:')
          var dtc = dtsc.pop().trim().replace(/,/, ' ')
          // console.log(dtc)
          job_array.push(dtc)
        }) 
        var result = chunkArray(job_array, 3)
        var final_results = add_elems_to_jubilee_array(result)
        // console.log(final_results)
        let sql=""
        for(let i = 0; i<final_results.length; i++) {
          sql = "SELECT * FROM jobs WHERE ref = '"+final_results[i][1]+"' LIMIT 1";
          con.query(sql, function(error, rt) {
            if(rt.length == 0) {
              sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
              con.query(sql, [[ final_results[i] ]] , function(e, rtt) {
                if(!e) {;
                  // console.log("Inserted");
                } else {
                  // console.log(e);
                }
              })
            } else {
              // console.log("Exists");
            }
          })
        }
      }
    })







  // get jobs from ga website
  let ga_job_array = []
  req('https://www.gakenya.com/ga-insurance-limited/working-at-ga/careers/', (err, res, html) => {
      if(!err && res.statusCode == 200) {
        const $ = cher.load(html);
        $('.career').map((jb,elm)=>{
          var title = $(elm).find('h3').text().trim().replace(/,/, ' ')
           // console.log(title)
          ga_job_array.push(title)
          var ref = "GA"
          // console.log(ref)
          ga_job_array.push(ref)
          var dtc = new Date()
          // console.log(dtc)
          ga_job_array.push(dtc)
        })
        var result = chunkArray(ga_job_array, 3)
        var final_results = add_elems_to_ga_array(result)
        // console.log(final_results)
        let sql=""
        for(let i = 0; i<final_results.length; i++) {
          sql = "SELECT * FROM jobs WHERE ref = '"+final_results[i][1]+"' LIMIT 1";
          con.query(sql, function(error, rt) {
            if(rt.length == 0) {
              sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
              con.query(sql, [[ final_results[i] ]] , function(e, rtt) {
                if(!e) {;
                  // console.log("Inserted");
                } else {
                  // console.log(e);
                }
              })
            } else {
              // console.log("Exists");
            }
          })
        }
      }
    })






















  // get jobs from kenidia website
  let ken_job_array = []
  req('https://www.kenindia.com/careers/', (err, res, html) => {
      if(!err && res.statusCode == 200) {
        const $ = cher.load(html);
        $('.width-31').map((jb,elm)=>{
          
            var title = $(elm).find('h3').text().trim().replace(/,/, ' ')
            // console.log(title)
            ken_job_array.push(title)
            var ref = "kenindia"

            // console.log(ref)
            ken_job_array.push(ref)
            var dtc = new Date()
            // console.log(dtc)
            ken_job_array.push(dtc)
          
          
        })
        var result = chunkArray(ken_job_array, 3)
        var final_results = add_elems_to_ken_array(result)
        // console.log(final_results)
        let sql=""
        for(let i = 0; i<final_results.length; i++) {
          sql = "SELECT * FROM jobs WHERE ref = '"+final_results[i][1]+"' LIMIT 1";
          con.query(sql, function(error, rt) {
            if(rt.length == 0) {
              sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
              con.query(sql, [[ final_results[i] ]] , function(e, rtt) {
                if(!e) {;
                  // console.log("Inserted");
                } else {
                  // console.log(e);
                }
              })
            } else {
              // console.log("Exists");
            }
          })
        }
      }
    })










// get jobs from heritage website
  let her_job_array = []
  req('https://www.heritageinsurance.co.ke/content/careers', (err, res, html) => {
      if(!err && res.statusCode == 200) {
        const $ = cher.load(html);
        $('div.collapsible-header').map((jb,elm)=>{
          
            var title = $(elm).find('.collapTxt').text().trim().replace(/,/, ' ')
            // console.log(title)
            her_job_array.push(title)
            var ref = "heritage"

            // console.log(ref)
            her_job_array.push(ref)
            var dtc = new Date()
            // console.log(dtc)
            her_job_array.push(dtc)
          
          
        })
        
        var result = chunkArray(her_job_array, 3)
        var final_results = add_elems_to_her_array(result)
        // console.log(final_results)
        let sql=""
        for(let i = 0; i<final_results.length; i++) {
          sql = "SELECT * FROM jobs WHERE ref = '"+final_results[i][1]+"' LIMIT 1";
          con.query(sql, function(error, rt) {
            if(rt.length == 0) {
              sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
              con.query(sql, [[ final_results[i] ]] , function(e, rtt) {
                if(!e) {;
                  // console.log("Inserted");
                } else {
                  // console.log(e);
                }
              })
            } else {
              // console.log("Exists");
            }
          })
        }
      }
    })










// get jobs from cic website
      let cic_job_array = []
      req('https://cic.co.ke/careers/', (err, res, html) => {
          if(!err && res.statusCode == 200) {
            const $ = cher.load(html);
            $('.rpwe-li').map((jbb,elmm)=>{
              var cic_title = toTitleCase($(elmm).find('.rpwe-title > a').text().trim().replace(/,/, ' '))
              var cic_time = $(elmm).find('.published').text().trim().replace(/,/, ' ')
              var cic_link = $(elmm).find('.rpwe-title > a').attr('href').trim();
              cic_job_array.push(cic_title,'cic',cic_time,'recruitment@cic.co.ke','CIC Group Limited','https://cic.co.ke/careers/',cic_link)
            })
            var cic_result = chunkArray(cic_job_array, 7)
            // console.log(cic_result)
            let cic_sql=""
            for(let i = 0; i<cic_result.length; i++) {
              cic_sql = "SELECT * FROM jobs WHERE title = '"+cic_result[i][0]+"' AND ref = '"+cic_result[i][1]+"' LIMIT 1";
              con.query(cic_sql, function(cic_error, cic_rt) {
                if(cic_rt.length == 0) {
                  cic_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link) VALUES ?";
                  con.query(cic_sql, [[ cic_result[i] ]] , function(cic_e, cic_rtt) {
                    if(!cic_e) {;
                      // console.log("Inserted");
                    } else {
                      // console.log(cic_e);
                    }
                  })
                } else {
                  // console.log("Exists");
                }
              })
            }
          }
        })








// get jobs from career point


      for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/accounting-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/accounting-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)

                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')
 



                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'accounting')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }
















      for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/banking-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/banking-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)


                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')




                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'banking')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    // console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }


















      for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/audit-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/audit-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)


                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')




                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'audit')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    // console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }












      for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/credit-control-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/credit-control-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)


                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')




                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'credit')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    // console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }













































       for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/insurance-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/insurance-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)


                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')




                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'ins')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    // console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }




















      for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/ngo-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/ngo-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)


                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')




                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'ngo')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    // console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }








      for(let i = 1; i < 5; i++) {
        let cp_job_array = []

        let page;
        if(i == 1) {
          page = "https://www.careerpointkenya.co.ke/category/hr-jobs-in-kenya/"
        } else {
          page = "https://www.careerpointkenya.co.ke/category/hr-jobs-in-kenya/page/"+i+"/"
        }

        req(page, (err, res, html) => {
          if(!err && res.statusCode == 200) {

              const $ = cher.load(html);

              $('article.job_posting').each((i, el) => {

                const cp_job_link = $(el).find('a.entry-title-link').attr('href').trim()
                req(cp_job_link, (er,rs, htm)=> {
                    if(!er && rs.statusCode == 200) {
                      let cp_emails = getEmails(htm)
                      if(cp_emails && cp_emails.length > 0) {


                        const cp_jb_title = $(el).find('a.entry-title-link').text().trim().replace(/,/, ' ')

                        if(cp_exp = cp_jb_title.split('. ')) {
                          // console.log(cp_job_link);
                          // console.log(cp_emails);
                          let cp_exp = cp_jb_title.split('. ')
                          let cp_job_title = cp_exp[0]
                          // console.log(cp_job_title)

                          let cp_company = cp_exp[1]
                          // console.log(cp_company)

                          const cp_time = $(el).find('.entry-time').text().trim().replace(/,/, ' ')
                          // console.log(cp_time)


                          cp_emails = [...new Set(cp_emails)]
                          let cp_ems = cp_emails.join(', ')




                            cp_sql = "SELECT * FROM jobs WHERE link = '"+cp_job_link+"' LIMIT 1";
                            con.query(cp_sql, function(cp_error, cp_rt) {
                              if(cp_rt.length == 0) {
                                cp_sql = "INSERT INTO jobs (title,ref,closing_date,email,company,website,link,type) VALUES ('"+cp_job_title+"', 'cp', '"+cp_time+"', '"+cp_ems+"','"+cp_company+"','https://www.careerpointkenya.co.ke/', '"+cp_job_link+"', 'hr')";
                                con.query(cp_sql,  function(cp_e, cp_rtt) {
                                  if(!cp_e) {;
                                    // console.log("Inserted");
                                  } else {
                                    // console.log(cp_e);
                                  }
                                })
                              } else {
                                // console.log("Exists");
                              }
                            })
                          }








                      }
                    }
                })






              })
            }

          })



      }

      // console.log(cp_job_array);






})
