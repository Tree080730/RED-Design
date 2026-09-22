import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { MouthFrame } from '../components/MouthFrame';
import './photo-confirm.css';

type PhotoConfirmProps={onBack:()=>void;onRetake:()=>void;onCheck:()=>void};

export default function PhotoConfirm({onBack,onRetake,onCheck}:PhotoConfirmProps){
 return <main className="confirm-page" aria-labelledby="confirm-title">
  <header className="confirm-header">
   <Button type="text" className="confirm-back" aria-label="Back to camera" icon={<LeftOutlined/>} onClick={onBack}/>
   <h1 id="confirm-title">Look good?</h1>
  </header>
  <div className="confirm-body">
   <div className="confirm-photo" role="img" aria-label="Captured photo placeholder"/>
   <div className="confirm-character"><MouthFrame className="confirm-mouth"/></div>
   <div className="confirm-actions">
    <Button type="primary" size="large" className="confirm-primary" onClick={onCheck}>Check food</Button>
    <Button size="large" className="confirm-again" onClick={onRetake}>Again</Button>
   </div>
  </div>
 </main>;
}
