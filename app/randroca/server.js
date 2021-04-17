const mysql = require('mysql');

function action(action, callback) {
    switch (action.action) {
        case "GetInfo":
            get_info(action.class, function(result) {
                info = {
                    Info: {}
                }
                info.Column = '10';
                info.Row = '8';
                info.Group = '9';
                info.Vertical_Group = [2, 2, 2, 2, 2]
                for (let key in result) {
                    if (result[key].Name != '')
                        info.Info[result[key].Name] = result[key]
                }
                callback(info)
            })
            break;
    }
}

function get_info(Class, callback) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'Randroca',
        password: 'H7ESPyiMMAdyah2p',
        database: 'randroca'
    });
    connection.connect();
    var Sql = "SELECT * FROM " + Class;
    //查
    connection.query(Sql, function(err, result) {
        //console.log(result[0].Avatar)
        callback(result);
        /*result.length == 0 ? callback(true) : callback(false, {
            'group': group,
            'uuid': uuid
        });*/
    });
    connection.end();
    //return Class;
}
module.exports = {
    action,
    get_info
};