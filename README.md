mongoose-protector
=========
This is a work in progress, I am currently using it on my own project, but I would not advise using it for your own at this point.

mongoose-protector is a mongoose plugin that provides attribute level access control on your mongoose models. Protector was designed to work with your existing access control, it only will protect your model, not your routes.


Version
----

0.0.1



Installation
--------------
```
todo
```



Usage
-----

```
// /model/Person.js
PersonSchema = new Schema({
    FirstName: String,
    LastName: String,
    Birthdate: Date,
    TelephoneNumber: Number,
    Address: String
});

PersonSchema.plugin(require('protector'));
mongoose.model('Person', PersonSchema)
    .setRules([
        {
            role: {
                name: 'admin',
                visible: {
                    '*':'*'
                },
                where: {
                
                }
            }
        
        },
        {
            role: {
                name: 'guest',
                visible: {
                    FirstName: 1
                },
                where: {
                
                }
            }
        
        }
    
    
    ]);
```

```
// Controller/Person.js

var Person = mongoose.model('Person');

//example
var role = 'guest';

Person.protect(role).find({}, function(err, persons) {

});

```

License
----



