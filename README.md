mongoose-protector
=========
This is a work in progress, I am currently using it on my own project, but I would not advise using it for your own at this point.

mongoose-protector is a mongoose plugin that provides attribute level access control on your mongoose models. Protector was designed to work with your existing access control, it only will protect your model, not your routes.

Installation
--------------
```
npm install mongoose-protector
```



Usage Quick Overview
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

PersonSchema.plugin(require('mongoose-protector'));

// Set rules on the model
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
                
                    FirstName: "$dynamic.firstName"
                
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

Person.protect(role, {firstName: 'John'}).find({}, function(err, persons) {

});

```

Currently Supported Mongoose Functions
----------

* find()
* findOne()

Rules
-----
Your rules define what can be done with a model and who can act on the model. You attach an array of rules to your model:

```
mongoose.model('Person', PersonSchema).setRules([])
```

A rule is an object of the following form (note, the object will be extended in the future beyond just the role top level key):

```
{
    role: {
        name: 'admin'
        visible: {
        
        },
        where: {
        
        }
    
    }

}
```

##Role
####.name
A string of your choice, used to identify your role.
####.visible
An object that basically is your attribute level access control. These are the fields you want returned to that particular user.
####.where
Where works exactly like a query in Mongodb. So, if you want your role to only fetch certain documents, you can specify that in where, using any standard mongoDB query.

#Usage


```
Person.protect(role).find({}, function(err, persons) {

});
```

## $dynamic
$dynamic is a keyword of this plugin, and it allows you to dynamically define "where" criteria. In a simple case, you could imagine, that you have a use case where you only want users fetch documents that belong to them, how you do that is up to you, but in this example, we'll just demonstrate using the user's name:
```
{
            role: {
                name: 'guest',
                visible: {
                    '*': '*' // allows all fields to be visible
                },
                where: {
                    // this is dynamic
                    name: "$dynamic.name"
                }
            }

        }
```

Above you can see that we have a dynamic query defined 

```name: "$dynamic.name"```

This allows us to pass in a value at runtime. How? Like so:
```
Person.protect(role, {name: 'John'}).find({}, function(err, persons) {

});```


License
----



