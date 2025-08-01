import React, { useState } from "react";
import DetectedObjectsList from "../ObjectDetector/DetectedObjectsList";
import styles from './TimeLogger.module.css';
function TimeLogger() {
  const Array = [
    { name: 'SESSION ID', id: 12345678 }
  ];
  const Readings = [
    { id1: 23, id2: 35, id3: 36, name: 'obstacle' },
    { id1: 23, id2: 35, id3: 36, name: 'obstacle' },
    { id1: 23, id2: 35, id3: 36, name: 'obstacle' },
    { id1: 23, id2: 35, id3: 36, name: 'obstacle' }
  ];
  return (
    
   <div className={styles.TimeLoggerDIv}>
    <br></br>
      <h1><b>USER MONITORING</b></h1><br></br>
      <div className={styles.Text}>
        <ul className={styles.list}>
      {Array.map(Array => (
          <li key={Array.id} className={styles.Session}>
            {Array.name}:<span className={styles.Text}>{Array.id}</span>
          </li>
        ))}
        </ul>
      
      </div>
      <br></br>
  
        <div className={styles.ReadingDiv}>
          <ul className={styles.list}>
           {Readings.map(Readings => (
            <li key={Readings.id1}>
              [{Readings.id1}:{Readings.id2}:{Readings.id3}] {Readings.name}

            </li>
          ))}
          </ul>
    
        </div>





    
    </div>
  )


}

export default TimeLogger;
