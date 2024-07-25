const fs    = require('fs');

module.exports = {
    
    page:   function(FILE){ 
        let response = fs.readFileSync(`./html/header.html`, 'utf8');  
        try {
            response += fs.readFileSync(`./html/body/${FILE}.html`, 'utf8'); 
        } catch (error) {}
        response += fs.readFileSync(`./html/footer.html`, 'utf8');  
        return response;
    },
}