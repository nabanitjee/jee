
const exam=new Date('2027-01-15');
const days=Math.ceil((exam-new Date())/86400000);
document.getElementById('countdown').textContent=`${days} days remaining`;
