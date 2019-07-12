var express = require('express')
var router = express.Router();
var nm = require('nodemailer')

var mysql = require('mysql')
var pdf = require('pdfkit')
var fs = require('fs')
var path = require('path')

var con = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "",
  database : 'nodejobs',

})








var curday = function(sp){
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //As January is 0.
	var yyyy = today.getFullYear();
	if(dd<10) dd='0'+dd;
	if(mm<10) mm='0'+mm;
	return (dd+sp+mm+sp+yyyy);
};



con.connect()

router.get('/', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('index', {
			"jobs": rows

		})
	})
	
})



router.get('/jubilee', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND company = 'Jubilee Insurance Ltd' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('jubilee', {
			"jobs": rows

		})
	})
	
})


router.get('/cic', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND ref = 'cic' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('cic', {
			"jobs": rows
		})
	})
	
})



router.get('/kenindia', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND ref = 'kenindia' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('ken', {
			"jobs": rows
		})
	})
	
})




router.get('/ga', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND ref = 'GA' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('ga', {
			"jobs": rows
		})
	})
	
})



router.get('/daystar', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND ref = 'daystar' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('daystar', {
			"jobs": rows
		})
	})
	
})


router.get('/strath', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND ref = 'strathmore' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('strathmore', {
			"jobs": rows
		})
	})
	
})



router.get('/heritage', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND ref = 'heritage' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('her', {
			"jobs": rows
		})
	})
	
})



router.get('/accounting', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'accounting' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('accounting', {
			"jobs": rows
		})
	})
	
})


router.get('/credit', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'credit' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('credit', {
			"jobs": rows
		})
	})
	
})


router.get('/banking', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'banking' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('banking', {
			"jobs": rows
		})
	})
	
})


router.get('/ins', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'ins' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('insurance', {
			"jobs": rows
		})
	})
	
})


router.get('/ngo', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'ngo' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('ngo', {
			"jobs": rows
		})
	})
	
})


router.get('/audit', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'audit' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('audit', {
			"jobs": rows
		})
	})
	
})




router.get('/hr', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE applicable = 1 AND type = 'hr' ORDER BY created_at DESC", function(err, rows, fields) {
		if(err) throw err;
		res.render('hr', {
			"jobs": rows
		})
	})
	
})




router.get('/edit/:id', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE id = ? ", req.params.id, function(err, row, fields) {
		if(err) throw err;
		res.render('edit', {
			"job": row[0]

		})
	})
	
})


router.get('/view/:id', function(req, res,next) {
	con.query("SELECT * FROM jobs WHERE id = ? ", req.params.id, function(err, row, fields) {
		if(err) throw err;

		if(row[0].applicable == 1) {
			con.query("UPDATE jobs SET seen = 1 WHERE id = '"+ req.params.id + "'", function(err, results) {
			console.log(results)
			
			})
			res.render('view', {
				"job": row[0]

			})
		} else {
			req.flash('msg', 'Not Applicable');

    		res.redirect('/');
		}

		
		
	})
	
})




router.post('/job/edit/:id', function(req,res,next) {

	var title = req.body.title;
	var company = req.body.company;
	var email = req.body.email;
	var ref = req.body.ref;
	var link = req.body.link;
	var website = req.body.website;

	var job = {
		title: title,
		company: company,
		email: email,
		ref: ref,
		link: link,
		website: website
	}

	con.query("UPDATE jobs SET ? WHERE id = '"+ req.params.id + "'", job, function(err, results) {
		if(err) throw err;
		console.log(results)
	})

	req.flash('success_msg', 'Project Updated');

    res.redirect('/view/'+req.params.id);
})







router.get('/na/:id', function(req, res,next) {

	con.query("UPDATE jobs SET applicable = 0 WHERE id = '"+ req.params.id + "'", function(err, results)  {
		if(err) throw err;
	})

	req.flash('success_msg', 'Job Updated');
    res.redirect('/view/'+req.params.id);
	
})







router.get('/appy/:id', function(req, res,next) {

	con.query("SELECT * FROM jobs WHERE id = ? ", req.params.id, function(err, row, fields) {
		if(err) throw err;
		
		if(row[0].apply == 1) {
			res.render('view', {
				"job": row[0]
			})
		} else {
			res.render('admin/apply', {
				"job": row[0]
			})
		}
		


	})
	
})








// apply

router.post('/job/apply/:id', function(req, res,next) {

	con.query("SELECT * FROM jobs WHERE id = ? ", req.params.id, function(err, row, fields) {
		if(err) throw err;
		
		if(row[0].company == "undefined") {
			req.flash('msg', 'Update Company Name');
    		res.redirect('/edit/'+req.params.id);
		} else {
			if(row[0].apply == 1)  {
				req.flash('msg', 'Already Applied For');
    			res.redirect('/view/'+req.params.id);
			} else {
				var doc = new pdf()

				var cv_name = `applications/${row[0].title} cover letter.pdf`
				var cv_path = `applications/Peter Njuno cv.pdf`
					doc.pipe(fs.createWriteStream(cv_name))
					doc.font('Helvetica-Bold').fontSize(11)
					doc.text(`Peter Njuno\nEmail: pnjuno@gmail.com\nMobile: 0711588950\nWebsite: http://165.22.203.175/master/`, { align: 'right'})
					doc.moveDown()

					doc.text(`${curday('/')}\n\nHuman Resource Manager, \n${row[0].company},\nNairobi.\n\nDear Sir / Madam, \n\n`)
					doc.moveDown()

					doc.text(`RE:APPLICATION FOR ${row[0].title.toUpperCase()} `, { underline: true})

					doc.moveDown()

					doc.text(`I am writing to kindly request consideration for the position of ${row[0].title} at ${row[0].company} as advertised at ${row[0].link}.`)
					doc.moveDown()
					doc.text(`I have over 5 years working experience in finance and insurance industry working at First Assurance’s finance medical department where I perform the daily reconciliation of cash accounts and accounts payables, pay medical service providers twice a month, manage service provider accounts, collections, allocations, updating and sharing of medical premiums statements, assists in internal and external audits, maintains list of journal entries and reconciliations and ensures that all are accounted for and have proper approvals among others.`)
					doc.moveDown()

					doc.text(`Am a MBA graduate set to graduate November 2019 at Jomo Kenyatta University and a former student of Catholic University where I studied Bachelor Degree of Commerce, Banking and Finance option. I am a team player who is not only self-motivated but also results oriented, always willing to learn, very innovative, work well under pressure and with little or no supervision. If offered an opportunity, I will display my dedication and diligence coupled with work ethics all towards achieving the organizations objectives.`)
					doc.moveDown()
					doc.text(`Thank you and I look forward to a good response.`)
					doc.moveDown()
					doc.text(`\n\nYours faithfully,\nPeter Njuno.`)


					

					doc.end()

				console.log("doc creates")


									var email_body = `
										<p>Dear Human Resource Manager</p>

										<p>Find below attached resume and cover letter for consideration of ${row[0].title} position at ${row[0].company}.</p>
											<br><br>
										<p>Regards<br>Njuno</p>
										`;

									var subject = ""

									if(row[0].company == "Jubilee Insurance Ltd") {
										subject = row[0].ref + " - " + row[0].title.toUpperCase()
									} else {
										subject = "APPLICATION FOR "+ row[0].title.toUpperCase()
									}

									let testAccount = nm.createTestAccount();

									 
									let transporter = nm.createTransport({
									    host: "smtp.gmail.com",
									    port: 587, 
									    secure: false, 
									    auth: {
									      user: 'mpnjuno@gmail.com', 
									      pass: 'Java_2147483647' 
									    }
									  });

									  // send mail with defined transport object
									let info =  transporter.sendMail({
									    from: '"Peter Njuno" <mpnjuno@gmail.com>', 
									    to: row[0].email, 
									    subject: subject, 
									    text: "", 
									    html: email_body,
									    attachments: [
									       {
									        path: cv_name
									       },
									       {
									        path: cv_path
									       }
									    ]
									  });

									console.log("Message sent: %s", info.messageId);
									  
									console.log("Preview URL: %s", nm.getTestMessageUrl(info));

				con.query("UPDATE jobs SET apply = 1, seen = 1 WHERE id = '"+ req.params.id + "'", function(err, results)  {
					if(err) throw err;
				})
				req.flash('success_msg', 'Job Updated');
	    		res.redirect('/view/'+req.params.id);
			}
			
		}
	})

	
	
})





module.exports = router