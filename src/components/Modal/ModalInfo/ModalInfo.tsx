import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cardInfoModal, groupInfoModal, studentsInfoModal, scheduleInfoModal} from '../../../typescript/main';
import { closeModalAction } from '../../../store/modalReducer';
import { RootState } from '../../../store/store';
import './ModalInfo.css'

function ModalInfo() {
  const modalContent = useSelector((state:RootState) => state.modal);
  const [modalInfo, setModalInfo] = useState<cardInfoModal & groupInfoModal | null>(null);
  const [modalInfoList, setModalInfoList] = useState<studentsInfoModal[] | null>(null);
  const [modalSchedule, setModalSchedule] = useState<scheduleInfoModal[] | null>(null)
  const dispatch = useDispatch();

  let modalHeader, modalBody;

  useEffect(() => {
    if (modalContent.modalActionDetail === 'infoAboutCard') {
      fetch(`http://localhost:3001/data/cards/${modalContent.modalData}`)
        .then(response => response.json())
        .then(data => setModalInfo({...data[0]}));
    } else if (modalContent.modalActionDetail === 'infoAboutGroup') {
      fetch(`http://localhost:3001/data/groups/${modalContent.modalData}`)
        .then(response => response.json())
        .then(data => setModalInfo({...data[0]}));
    } else if(modalContent.modalActionDetail === 'infoAboutStudents') {
      fetch(`http://localhost:3001/data/students/${modalContent.modalData}`)
        .then(response => response.json())
        .then(data => setModalInfoList([...data]));
    } else if(modalContent.modalActionDetail === 'infoAboutSchedule') {
      fetch('http://localhost:3001/data/schedule')
        .then(response => response.json())
        .then(data => setModalSchedule([...data]));
    } else if(modalContent.modalActionDetail === 'addClient') {
      fetch(`http://localhost:3001/data/groups`)
        .then(response => response.json())
        .then(data => setModalInfoList([...data]));
    }
  }, []);


  if (modalContent.modalActionDetail === 'infoAboutCard') {
    modalHeader = <div className="modalTitle">Информация по абонементу</div>
    modalBody = <table className='modalTableInfo'>
      <tr>
        <th>№ абонемента</th>
        <td>{modalInfo && modalInfo.idCard}</td>
      </tr>
      <tr>
        <th>Вид абонемента</th>
        <td>{modalInfo && modalInfo.cardKind}</td>
      </tr>
      <tr>
        <th>Стоимость абонемента</th>
        <td>{modalInfo && modalInfo.cardPrice}</td>
      </tr>
      <tr>
        <th>Группа</th>
        <td>{modalInfo && modalInfo.groupName}</td>
      </tr>
      <tr>
        <th>Тренер</th>
        <td>{modalInfo && modalInfo.trainer}</td>
      </tr>
    </table>
  } else if (modalContent.modalActionDetail === 'infoAboutGroup') {
    modalHeader = <div className="modalTitle">Информация о группе</div>
    modalBody = <table className="modalTableInfo">
      <tr>
        <th>Группа</th>
        <td>{modalInfo && modalInfo.groupName}</td>
      </tr>
      <tr>
        <th>Вид спорта</th>
        <td>{modalInfo && modalInfo.sportKind}</td>
      </tr>
      <tr>
        <th>Возростная группа</th>
        <td>{modalInfo && modalInfo.ageKind}</td>
      </tr>
      <tr>
        <th>Зал</th>
        <td>{modalInfo && modalInfo.hallKind}</td>
      </tr>
    </table>
  } else if (modalContent.modalActionDetail === 'infoAboutStudents') {
    modalHeader = <div className="modalTitle">Состав группы</div>
    modalBody = <table className="modalTableInfo">
      <tr>
        <th>ФИО</th>
        <th>№ абонемента</th>
      </tr>
      { 
        modalInfoList && modalInfoList.map((data, index) => {
          return <tr key={index}>
            <td>{data.client}</td>
            <td>{data.idCard}</td>
          </tr>
        })
      }
    </table>
  } else if (modalContent.modalActionDetail === 'infoAboutSchedule') {
    const currentDate = modalContent.modalData;
    //@ts-expect-error
    const currentDay = (currentDate.getDate() < 10) ? `0${currentDate.getDate()}` : currentDate.getDate();
    //@ts-expect-error
    const currentMonth = ((currentDate.getMonth() + 1) < 10) ? `0${currentDate.getMonth() + 1}` : (currentDate.getMonth() + 1);
    //@ts-expect-error
    const currentYear = currentDate.getFullYear();
    //@ts-expect-error
    const filterSchedule = modalSchedule && modalSchedule.filter((data) => (data.lessonRepeat && data.lessonDay === currentDate.getDay()) || (data.lessonDate === currentDate));
    modalHeader = <div className="modalTitle">Расписание - {currentDay}.{currentMonth}.{currentYear}</div>
    modalBody = (!filterSchedule?.length) ? <p style={{textAlign: 'center', fontSize: '18px', opacity: '0.5'}}>Занятий нет</p> : <table className="modalTableInfo">
      <tr>
        <th>Группа</th>
        <th>Время занятия</th>
        <th>Зал</th>
      </tr>
      
      {
        modalSchedule && filterSchedule.map((data, index) => {
          console.log(data);
          return <tr key={index}>
            <td>{data.groupName}</td>
            <td>{`${(data.timeStart/100).toFixed(2)} - ${(data.timeEnd/100).toFixed(2)}`}</td>
            <td>{data.hallKind}</td>
          </tr>
        })
      }
    </table>
  }


  return ( 
    <div className="modalOverlay">
      <div className="Modal">
        <div className="modalHeader">
          {modalHeader}
          <svg className='modalClose' onClick={() => dispatch(closeModalAction())} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </div>
        <div className="modalBody">
          {(modalInfo || modalInfoList || modalSchedule) && modalBody}
        </div>
      </div>
    </div>
  );
}

export default ModalInfo;