# node-webapp-template

## Table of Contents
* [General Information](#general-information)
* [Please Donate](#please-donate)
* [Releases](#releases)
* [Pre-Requirements](#pre-requirements)
* [Setup](#setup)

## General Information
* This template was built top help people quickly setup a development environment and focus on their business rules
* Most of the work to build standard objects for web/hybrid mobile apps is done, it means you can set parameters and call functions according to your needs and UI elements will be displayed 
* This template relies on top technologies for both back-end and front-end
* Of course, there's always room for improvements, so check the plans for future releases

## Please Donate
* Honestly, this webapp template will save you a lot of work and time so why not giving something back to the author?
* Once you install and run the template, please check the donation box at your upper right

## Releases
* V.1.0.0 (current release)
* V.1.1.0
** Bug fixes of V.1.0.0 (if found)
** Support to mysql (remaining implementation on user authentication and user management services)
* V.1.2.0
** Bug fixes of V.1.1.0 (if found)
** Support to mongoDB
* V.2.0.0
** Bug fixes of V.1.2.0 (if found)
** Update to Bootstrap 5.x
** Update to Angular.js 1.8.2

## Pre-Requirements
* In order to run this template you must have the following packages installed:
** node.js version 10.8.0 or later
** mysql/Maria DB version 10.8.0 or later (required for Release 1.1.0)

## Setup
* Just clone the repository or copy the files to your disk
* Edit the file /path/to/node-webapp-template/config//path/to/node-webapp-config.json and set TCP_PORT and mysql/Maria DB credentials according to your enviroment
```
{
    "app_parameters": {
        "tcp_port": 8080,
        "debug_mode": "D"
    },
    "app_mysql_db": {
        "host": "192.168.0.10",
        "username": "nwtemplate_usr",
        "password": "nwtemplate_usr",
        "database": "NODE_WEB_TEMPLATE"
    }
}
```
* Open a terminal screen and go to the folder you used /path/to/node-webapp-template/ and run the following command:
```
nodemon apps.js
```
* Open a web browser and type the URL "://localhost:8080" (Please notice the port 8080 is set in the config file)