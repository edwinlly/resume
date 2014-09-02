# -*- coding: utf-8 -*-
from bottle import route,  default_app, run
from bottle import  static_file



@route('/hello')
def hello():
    return "Hello World!"

import logging
logging.basicConfig(filename='log.txt', format=logging.BASIC_FORMAT)

from resume.rest.CirrusRestAPI import *

APIROOT = '/rest'
loginAPI = cLoginAPI()
resumeAPI = cResumeAPI()
app = default_app()

app.route(APIROOT + '/login-sessions', callback = loginAPI.validate, method = 'POST')
app.route(APIROOT + '/resumes/<rid>', callback = resumeAPI.getAResume, method = 'GET')
app.route(APIROOT + '/resumes', callback = resumeAPI.getAllResume, method = 'GET')

#This route must be put at the end of file
#本route必须被放置到最后一条
@route('/<filename:path>')
def server_static(filename):
    print filename
    return static_file(filename, root='./static/')

log = open('access_log', 'a')

run(host='localhost', port=8080, debug=True)
