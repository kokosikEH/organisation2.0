from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from backend import database, queries
from datetime import datetime, date
import pandas as pd
import csv
import sqlite3
import openpyxl


# database.db_create_tables()





def make_obj_inf():
    n = queries.get_count()[0]
    res = []
    for i in range(1, n + 1):
        q = queries.get_object_info(i)
        res.append({'id': i, 'address': q[0], 'county': q[1], 'district': q[2], 'object_type': q[3], 'owner': q[4],
                    'condition': q[5], 'coordinates': q[6].split(', ')})
    return res[::-1]


def make_meet_inf():
    n = queries.get_count_meet()[0]
    res = []
    for i in range(1, n + 1):
        q = queries.get_meetings_info(i)
        res.append({'date_of_meeting': q[0], 'group': q[1], 'url': q[2], 'agenda': q[3]})
    return res[::-1]


@csrf_exempt
def index(request):
    print(request)
    q = request.POST
    print(q)
    if 'district' in q.keys():
        print(1)
        make_object(q)

    return render(request, "base.html")


def update_meeting(q):
    agenda_id = q['id']
    d = q['date_of_meeting']
    ref = q['reference']
    # wg_id = queries.get_wg_id(agenda_id)[0][0]
    # print(wg_id)
    date = d 

    database.insert_meeting(None, agenda_id, agenda_id, date, ref)


def update_feedback(q):
    id = q['id']
    feedback = q['feedback']
    queries.update_feed_task_by_id(id, feedback)

@csrf_exempt
def protocol(request):
    q = request.POST

    if 'date_of_meeting' in q.keys():
        update_meeting(q)
    else:
        update_feedback(q)

    return render(request, "base.html")


def make_object(q):
    county = q['county']
    district = q['district']
    address = q['address']
    company = q['company']
    coordinate = q['coordinate']
    object_type = q['object_type']
    square = q['square']
    owner = q['owner']
    actual_user = q['actual_user']
    media = q['media']
    message = q['message']

    database.insert_object(None, county, district, address, company, 
                           object_type, 'new', coordinate, square, owner, actual_user, message, media)


def make_task(q):
    description = q['description']
    group = q['group']
    deadline = q['deadline']
    date = deadline[5:7] + '/' + deadline[8:10] + '/' + deadline[0:4]
    id = q['id']
    wg_id = queries.get_id_group_by_name(group)

    database.insert_task(None, id, description, 'new', datetime.now(), date, wg_id, None, None, None)


def update(q):
    status = q['status']
    id = q['id']
    queries.update_status_task_by_id(id, status)


def add_report(q):
    wg_report = q['wg_report']
    id = q['id']
    queries.add_report_task_by_id(id, wg_report)


@csrf_exempt
def object(request):
    q = request.POST

    if 'status' in q.keys():
        update(q)
    elif 'wg_report' in q.keys():
        add_report(q)
    elif 'district' in q.keys():
        make_object(q)
    else:
        make_task(q)

    return render(request, "base.html")


def api_table(request):
    reester = make_obj_inf()
    return JsonResponse(reester, safe=False)
    # return JsonResponse({'name': 'ded'})


def api_meet(request):
    meet = make_meet_inf()
    return JsonResponse(meet, safe=False)



def api_obj(request):
    q = request.GET['query']
    res = queries.get_object_info_2(q)
    res2 = queries.get_povistka(q)
    if res2 is None:
        res2 = ['не создана', '-', '-']
    ans = {'adress':res[0], 'county':res[1], 'district':res[2], '':res[3], 'coordinates':res[4],  'coord':res[4].split(', '), 'cadastral_number':res[5],
           'object_type': res[6], 'condition':res[7], 'square':res[8], 'owner':res[9], 'actual_user':res[10], 'additional_info':res[11], 'agenda_id':res2[0], 'agenda_date':res2[1], 'wg_id':res2[2]}

    return JsonResponse(ans, safe=False)


def make_obj_table(q):
    tmp = queries.tasks_by_object(q)
    n = len(tmp)
    res = []
    for i in range(0, n):
        q = tmp[i]
        res.append({'id':q[0], 'time_stamp':q[1], 'description':q[2], 'deadline':q[3], 'wg_group':q[4], 'status':q[5], 'wg_report': q[6]})
    return res

def api_obj_table(request):
    q = request.GET['query']

    res = make_obj_table(q)
    return JsonResponse(res, safe=False)


def make_prot_table1(q):
    tmp = queries.povistka_info(q)
    n = len(tmp)
    res = []
    for i in range(0, n):
        q = tmp[i]
        res.append({'id':q[0], 'address':q[1], 'county':q[2], 'district':q[3], 'object_type':q[4], 'owner':q[5]})
    return res

def api_prot_table1(request):
    q = request.GET['query']

    print('!?!?!?!?!?!?!??', q)
    res = make_prot_table1(q)
    return JsonResponse(res, safe=False)

def make_prot_table2(q):
    tmp = queries.protocol_info(q)
    n = len(tmp)
    res = []
    for i in range(0, n):
        q = tmp[i]
        res.append({'id':q[0], 'address':q[1], 'county':q[2], 'district':q[3], 'cadastral_number':q[4], 'date_of_meeting':q[5], 'description':q[6], 'feedback':q[7]})
    return res

def api_prot_table2(request):
    q = request.GET['query']

    res = make_prot_table2(q)
    return JsonResponse(res, safe=False)

def api_prot(request):
    q = request.GET['query']
    res = queries.get_meetings_info1(q)

    return JsonResponse({'date_of_meeting':res[0], 'group':res[1], 'url':res[2]}, safe=False)


@csrf_exempt
def download_registry(request):
    conn = sqlite3.connect('backend/db/database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM objects')
    data = cursor.fetchall()
    df = pd.DataFrame(data)
    conn.close()
    output = pd.ExcelWriter('registry.xlsx')
    df.columns = ['ID', 'Округ', 'Район', 'Адрес', 'Кадастровый номер', 'Тип', 'Состояние', 'Координаты', 'Площадь объекта', 'Собственник', 'Фактический пользователь', 'Дополнительная информация',  'Фото']
    df.to_excel(output, 'Sheet1', index=False)
    output.close()

    # Отправка Excel-файла пользователю
    with open('registry.xlsx', 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=data.xlsx'
    return response


@csrf_exempt
def download_protocol(request):
    print(request)
    conn = sqlite3.connect('backend/db/database.db')
    cursor = conn.cursor()
    
    q = request.GET['query']
    print(q)
    cursor.execute('''SELECT tasks.id, objects.address, objects.county, objects.district, objects.cadastral_number, tasks.deadline, tasks.description, tasks.feedback FROM tasks
                        join objects on tasks.object_id = objects.id
    					WHERE tasks.wg_id = {key}'''.format(key=q))
    data = cursor.fetchall()
    df = pd.DataFrame(data)
    conn.close()
    output = pd.ExcelWriter('protocol.xlsx')
    df.columns = ['ID','Адрес','Округ','Район','Кадастровый номер','Дата рассмотрения','Формулировка задачи','Решение']
    df.to_excel(output, 'Sheet1', index=False)
    output.close()

    # Отправка Excel-файла пользователю
    with open('protocol.xlsx', 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=data.xlsx'
    return response