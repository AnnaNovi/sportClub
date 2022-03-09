import { Header } from "../components";


function Admin() {
  const currentDay = new Date();
  const currentDate = (currentDay.getDate() < 10) ? `0${currentDay.getDate()}` : currentDay.getDate();
  const currentMonth = ((currentDay.getMonth() + 1) < 10) ? `0${currentDay.getMonth() + 1}` : (currentDay.getMonth() + 1);
  const currentYear = currentDay.getFullYear();
  return ( 
    <div className="Admin">
      <Header />
      <footer style={{position: 'absolute', bottom: '20px', right: '50%', transform: 'translate(50%, 0%)'}}>{`${currentDate}.${currentMonth}.${currentYear}`}</footer>
    </div>
  );
}

export default Admin