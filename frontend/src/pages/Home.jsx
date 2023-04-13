import React, { useEffect , useState, } from "react";
import { Link, useParams} from 'react-router-dom';
import '../App.css';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import MyNav from "../components/MyNav";
import { imgg } from '../mockData';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Object from "../components/modal/modall";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';


const slideLeft = () => {
  var slider = document.getElementById('slider');
  slider.scrollLeft = slider.scrollLeft - 500;
};

const slideRight = () => {
  var slider = document.getElementById('slider');
  slider.scrollLeft = slider.scrollLeft + 500;
};


function Home() {
  const [tab, getTab] = useState([])
  const URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
      fetchTab()
  }, [])


  const fetchTab = () => {
      fetch('http://127.0.0.1:8000/api/table')
          .then((res) =>
              res.json())

          .then((response) => {
              console.log(response);
              getTab(response);
          })

  }

    const [mit, getMit] = useState([])

  useEffect(() => {
      fetchMit()
  }, [])


  const fetchMit = () => {
      fetch('http://127.0.0.1:8000/api/meet')
          .then((res) =>
              res.json())

          .then((response) => {
              console.log(response);
              getMit(response);
          })

  }

  const chart = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page b', uv: 300, pv: 2400, amt: 2400}, {name: 'Page c', uv: 300, pv: 2400, amt: 2400}, {name: 'Page d', uv: 200, pv: 2400, amt: 2400},{name: 'Page e', uv: 278, pv: 2400, amt: 2400}, {name: 'Page f', uv: 189, pv: 2400, amt: 2400}]
  const dataa = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  
  const params = useParams();
    const path = `/odject/${params.id}`
    const [modalOn, setModalOn] = useState(false);
const [choice, setChoice] = useState(false)

const clicked = () => {
  setModalOn(true)
}

  return (
        
    <div>
       <MyNav className="z-30"/>

       <div className="box3 mt-[70px] z-10">
          <div className="box z-0">
            <b className='right'>
              Реестр
                <button
        className="bg-red-100 mt-1 text-black active:bg-red-200 font-bold uppercase text-sm ml-10 px-6 py-3 rounded mr-1 mb-1 ease-linear transition-all "
        type="button"
        onClick={clicked}
      >
        Создать объект
      </button>
      

    {modalOn && < Object setModalOn={setModalOn} setChoice={setChoice} />}
            </b>  
            <div className="h-[430px] overflow-y-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide">
              <Table >
              <thead>
                <tr>
                  <th>ID объекта</th>
                  <th>округ</th>
                  <th>район</th>
                  <th>адрес</th>
                  <th>тип</th>
                  <th>состояние</th>
                  <th>собственник</th>
                </tr>
              </thead>

              <tbody>
                {tab.map((item, i) => (
                             <tr >
                                
                                <td>
                                  <Link to={'/object/'+ item.id + '?query='+ item.id} >
                                    <b className="underline"> {item.id}</b>
                                  </Link>
                                </td>                              
                                <td>{item.county}</td>
                                <td>{item.district}</td>
                                <td>{item.address}</td>
                                <td>{item.object_type}</td>
                                <td>{item.condition}</td>
                                <td>{item.owner}</td>
                            </tr>
                            
                            
                        ))}
                  </tbody>
            </Table>
            </div>
            
          </div>
        </div>
      

       <div className="menu mt-[20px]">
        <div className="box1">
        
    
<div class="flex flex-col bg-white m-auto p-auto">

      <div class="flex overflow-x-scroll mt-10  scrollbar-hide pb-10 hide-scroll-bar rounded-2xl" >
        <div class="flex flex-nowrap   scrollbar-hide rounded-2xl" > 
        {mit.map((item) => (
           <div class="inline-block px-3">
           <div
             class="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
           >
            <black className='right '>
            <b>встреча</b>
            <div className="pl-2 text-left"> <br/><br/>
            <b className="text-xl">Дата: </b> 
            <b className="text-xl font-normal">{item.date_of_meeting}</b>
            <br/>
            <b className="text-xl">Раб. группа: </b> 
            <b className="text-xl font-normal">{item.group} </b>
             
            <br/>
                <a href={item.url} >
            <b className="text-xl underline ">Ссылка</b>
                </a>
             
            <br/>
            <Link to={'/protocol/'+ item.agenda + '?query='+ item.agenda} >
            <b className="text-xl underline">Повестка: {item.agenda}</b>
                                  </Link><br/>
            </div>
            

          </black>
           </div>
         </div>
             
            
          ))}
          
         
        </div>
      </div>
</div>

        </div>

      <div className="box2"> 
          <div className="boxx mt-[10px] ml-[-10px] w-[104%]">
          <b className='right'>
            Kарта
          </b>
            <div className='h-[310px]'>
               <YMaps > 
              <Map height= '295px' width='100%' defaultState={{ center: [55.75, 37.57], zoom: 9}} >
                {tab.map((item, i) => (
                              <Placemark geometry={item.coordinates} />
                              
                          ))}
              <Placemark geometry={[55.684758, 37.738521]} />
              </Map>
           </YMaps>
            </div>
           
          </div>
      </div>
      
      </div>
      <div className="menu mt-[20px]">
        <div className="box1 mt-[-150px]">
            <div className="box h-[450px]">
              
              <ResponsiveContainer  width="100%" height="100%" >
          <LineChart
            width={500}
            height={300}
            data={dataa}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
              </div>
              
            </div>

            <div className="box2 h-[500px]"> 
          <div className="box h-[450px] mt-[-150px] ">
          <br/>
           <b className="right">info</b>
           <br/><br/>
           На данный момент график не представляет какой-либо анализ.
           <br/>
           Это демонстрационный вариант, при наличии достаточного количества данных можно будет сформировать аналитику.
          </div>
      </div>
          </div>

        </div>
        
      
       
  

    );
};

export default Home;
