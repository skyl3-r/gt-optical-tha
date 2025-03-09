const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const csvParser = require('csv-parser');
const os = require('os')
const multer = require('multer')
const upload = multer({dest: os.tmpdir()}) // store file uploaded in temp dir
const stringify = require('csv-stringify').stringify

app.get('/', (req, res) => {
    res.send(`<a href='http://localhost:${port}/users'>Go to users page</a>`);
})

// /users
app.get('/users', (req, res) => {
    // get query params
    // if params are invalid, will be changed to default
    const min = parseFloat(req.query.min) || 0.0;
    const max = parseFloat(req.query.max) || 4000.0;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || null;
    var sort = req.query.sort;
    if (!['NAME', 'SALARY'].includes(sort)) {
        sort = null;
    }

    // console.log(min, max, offset, limit, sort)

    // read data.csv
    const result = [];
    fs.createReadStream("./data.csv")
        .pipe(csvParser({
            skipLines: 1,
            headers: ['name', 'salary']
        }))
        .on("data", (data) => {
            data.salary = parseFloat(data.salary)

            // filter by min and max
            if (data.salary >= min && data.salary <= max) {
                result.push(data);
            }
        })
        .on("end", () => {
            // sort results
            if (sort === 'NAME') {
                result.sort((a, b) => {
                    const first = a.name.toLowerCase();
                    const second = b.name.toLowerCase();
                    if (first < second) {
                        return -1;
                    } else if (first > second) {
                        return 1;
                    }
                    return 0;
                })
            } else if (sort === 'SALARY') {
                result.sort((a, b) => a.salary - b.salary);
            }

            // offset and limit for results 
            var result_cut;
            if (limit == null) {
                result_cut = result.slice(offset);
            } else {
                result_cut = result.slice(offset, offset + limit);
            }

            // return result
            res.status(200).json({"results": result_cut});
        })
})

// /upload
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file

    const result = [];
    var resped = false;

    fs.createReadStream(file.path)
    .pipe(csvParser({
        skipLines: 1,
        headers: ['name', 'salary'],
        strict: true
    }))
    .on("data", (data) => {
        data.salary = parseFloat(data.salary)
        if (isNaN(data.salary)) {
            // wrong format, reject the csv file
            resped = true
            res.status(400).json({"success": 0, "error": "Salary number cannot be parsed"});
        } 
        
        if (data.salary >= 0) {
            // salary valid, don't skip the row
            result.push(data)
        }
    })
    .on("end", () => {
        if (!resped) {
            // data is already validated
            // now save data
            resped = true;

            // console.log(result)
            updateCsv(result, (updateResp) => {
                if (updateResp.success === "0") {
                    res.status(400).json(updateResp)
                } else {
                    res.status(200).json(updateResp);
                }
            })
        }
    })
    .on("error", (e) => {
        if (!resped) {
            resped = true;
            res.status(400).json({"success": 0, "error": e.message});
        }
    })

})

app.listen(port, () => {
    console.log(`View users at http://localhost:${port}/users`)
})


function updateCsv(newData, callback) {
    // read current data.csv
    const currData = [];
    fs.createReadStream("./data.csv")
        .pipe(csvParser({
            skipLines: 1,
            headers: ['name', 'salary']
        }))
        .on("data", (data) => {
            data.salary = parseFloat(data.salary);
            currData.push(data);
        })
        .on("end", () => {
            // for each row in newData, check if name exists in currData
            // if it does, update the row, if it doesn't, add new row
            newData.forEach(newR => {
                const i = currData.findIndex(currR => newR.name === currR.name);
                if (i !== -1) {
                    // exists
                    currData[i].salary = newR.salary;
                } else {
                    // not exists
                    currData.push(newR)
                }
            });

            // console.log(currData);
            const changedColData = currData.map(row => ({
                Name: row.name,
                Salary: row.salary
            }))

            // write data w stringify
            stringify(changedColData, {
                header: true,
                columns: ['Name', 'Salary']
            }, (err, str) => {
                fs.writeFile("./data.csv", str, 'utf-8', (err) => {
                    if (err) {
                        return callback({"success": 0, "error": err});
                    } else {
                        return callback({"success": 1})
                    }
                })
            })
        })
}