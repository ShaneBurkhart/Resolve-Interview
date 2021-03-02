**Note:** Please do not fork this repository. Just clone it.

# Overview

This purpose of this exercise is to recreate part of a service we currently have in our production systems. It is to help you get your hands dirty with tasks we've had to tackle before (in a reasonable amount of take-home time) and it is for us to understand your ability to bring requirements to life with code.


# Background

The data that Resolve ingests is Building Information Modeling data, or BIM for short. What makes it different than a standard 3D model is that in addition to having vertex, triangle, material, etc. data to visually represent the building it also has useful metadata about the building components. This helps lets you do things like identify doors and walls, understand how much structural load a beam can withstand, or how much electricity you can run through conduit. It allows our customers to walk up to elements in VR and then better understand what they're looking at.

The image below shows the *Properties* menu in our VR app. It allows you to select an object and query for it's metadata. The data associated with properties can be quite large (gigabytes for the large projects that are common on the platform) so we fetch properties at runtime from a server instead of making the user wait for a gigabyte sized download.

Getting this feature to work in our app has a lot of moving parts and we'd like to see how you would tackle a small part of it. 

![](https://www.resolvebim.com/s/resolve_vr_bim_properties.png)

# Objectives

You will build a service and client which retrieves the data when necessary and displays it in a human readable way. Once complete please share a video of your working implementation + your code for us to review. There's no time limit - the basics should take you 2-3 hours. Spend as much or as little time on this exercise as you'd like.

What you need to do:

1. Build a service that returns property data for a specific object id - It needs to download the SQLite file, accept requests with specific object id's, and return the data for requested objects. *Why download it instead of just having it hosted in this repo?* We fetch files like this for **every** model because they're unique and come from 3rd party sources. So we want to see how you'd tackle this. The file is hosted on AWS here: https://resolve-dev-public.s3.amazonaws.com/sample-data/interview/props.db 
2. Build a client that requests and displays property data from #1 - you have creative freedom here. this can be a simple web page, a CLI, a Unity app, or anything else that gets the job done. The most important requirement is that it displays the data in a format similar to the image above (not in 3D) - the name of the selected element should be explicitly stated and properties should be grouped by category. This should not be part of the same process running the code in #1. We want to see how you make things talk to each other.
3. Provide a video demo of your code working and a link to the code for us to review.

Please complete as much or as little of the project as you'd like. You have freedom to implement the service for retrieving the data and client for fetching and displaying the data using whatever frameworks and languages you'd like. We'll use your implementation as a basis for discussion at a later date so keep track of any ideas, bugs, or deficiencies we can discuss together.

## About the data

The SQLite file stores object properties using an Entity Attribute Value (EAV) model. 

The `entity_id` corresponds to the object id that your client would be requesting. 

You can assume properties are grouped by *category* and that categories prefixed with `__` should not be shown to the user.

## Example

The object id `7600` corresponds to the object **Transformer1 [338678]**.

The JSON formatted version of these properties could look something like this (it's truncated):
```
{
    "objectid":7600,
    "name":"Transformer1 [338678]",
    "properties":{
        "Constraints":{
            "Level":"Ground Floor ",
            "Moves With Nearby Elements":"No"
        },
        "Dimensions":{
            "Volume":"95.712623343811"
        },
        "Identity Data":{
            "Assembly Code":" ",
            "Assembly Description":" ",
            "Code Name":" ",
            "Comments":" ",
            "Cost":"0 ",
            "Description":" ",
            "Image":" ",
            "Keynote":" ",
            "Manufacturer":" ",
            "Mark":" ",
            "Model":" ",
            "OmniClass Number":" ",
            "OmniClass Title":" ",
            "Type Comments":" ",
            "Type Image":" ",
            "Type Mark":" ",
            "Type Name":"Transformer1",
            "URL":" "
        }
        .
        .
        .
    }
}
```

The object id `8862` corresponds to a **Horizontal Bend-Ladder [393403]**.

```
{
    "objectid":8862,
    "name":"Horizontal Bend-Ladder [393403]",
    "properties":{
        "Constraints":{
            "Host":"Level : Ground Floor ",
            "Level":"Ground Floor ",
            "Offset":"-3100.0"
        },
        "Dimensions":{
            "":"450",
            "Bend Radius":"2000",
            "Rung Height":"25.39999998984",
            "Rung Space":"228.6,
            "Rung Width":"25.39999998984",
            "Size":"450 mmx150 mm-450 mmx150 mm",
            "Thickness":"25.39999998984"
        }
        .
        .
        .
    }
}
```


If you find yourself wanting more here are some things you can consider for extra credit:
- Create instructions for how this would be run locally and/or deployed
- Aggregate property data for the requested object id and all it's parents
- cache results
- format output based on it's data type and precision
