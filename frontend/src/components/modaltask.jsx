import React, {Fragment, useState} from "react";
import Example from "./formm"
import Examples from "./formtask"

const handleOKClick = () => {
    setChoice(true)
    setModalOn(false)
}
const handleCancelClick = () => {
    setChoice(false)
    setModalOn(false)
}

const Task = ({ setModalOn, setChoice }) => {

    return (

        <div className="  w=[50%] bg-zinc-200 opacity-100 fixed inset-0 z-50   ">
<Examples/>
            <div className="flex w-[50%] mx-auto h-screen justify-center items-center ">

                <div className="flex-col justify-center  bg-white py-12 px-24 border-4 border-sky-500 rounded-xl ">

                    <div className="flex  text-lg  text-zinc-600   mb-10" >Are you sure ?</div>
                    <div className="flex">
                        <button onClick={handleOKClick} className=" rounded px-4 py-2 text-white  bg-green-400 ">Yes</button>
                        <button onClick={handleCancelClick} className="rounded px-4 py-2 ml-4 text-white bg-blue-500 ">No</button>
                    </div>

                </div>
            </div>
        </div>

    );
}
export default Task
