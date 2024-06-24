import surveyAPIList from '@/services/survey';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { today } from '@/utils/date';
const SurveyTeacherDetailPage = () => {
  const {surveyId} = useParams()
  const [surveyData,setSurveyData] = useState<any>()
  const getSurveyData = async () => {
    try {
      const res = await surveyAPIList.getDetailSurvey(Number(surveyId));
      const updatedData = res.map((item: any) => ({
        ...item,
        isNew: item.createdAt === today,
      }));
      console.log(updatedData);
      setSurveyData(updatedData);
    } catch (error) {
      
    } 
  }
  useEffect(() => {
    getSurveyData();
  },[])
  return (
    <>
      <div className={styles.DetailContainer}>
        <div className={styles.SurveyDetail}>
          <h2>{surveyData?.title}</h2>
          <div className={styles.Date}>
            <span className={styles.EndAt}>마감일 {surveyData?.endAt}</span>
          </div>
        </div>
      </div>
    </>
  );
} 

export default SurveyTeacherDetailPage;