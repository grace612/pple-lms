import surveyAPIList from '@/services/survey';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { today } from '@/utils/date';
import SummaryChart from '@/components/common/SurveySummary/chart';
import Title from '@/components/common/Title/Title';
import StudentTable from '@/components/common/StudentTable';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
const SurveyTeacherDetailPage = () => {
  const { surveyId } = useParams();
  const [surveyData, setSurveyData] = useState<any>();
  const [isSummary, setIsSummary] = useState(true); //default
  const [students, setStudents] = useState([]);
  const getSurveyData = async () => {
    try {
      if(isSummary) {
        const res = await surveyAPIList.getSurveySummaryList(Number(surveyId));
        console.log(res);
        setSurveyData(res);
      } else {
        const res = await surveyAPIList.getSurveyStudentList(Number(surveyId));
        console.log(res);
        setStudents(res);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getSurveyData();
  }, [isSummary]);
  return (
    <>
      <div className={styles.DetailContainer}>
        <div className={styles.SurveyDetail}>
          <h2>{surveyData?.title}</h2>
          <div className={styles.Date}>
            <span className={styles.EndAt}>마감일 {surveyData?.endAt}</span>
          </div>
          <div className={styles.StudentFlexWrap}>
            <div
              onClick={() => {
                setIsSummary(true);
              }}
              className={`${styles.StudentChild} ${isSummary && styles.Active}`}
            >
              요약
            </div>
            <div
              onClick={() => {
                setIsSummary(false);
              }}
              className={`${styles.StudentChild} ${!isSummary && styles.Active}`}
            >
              개별보기
            </div>
          </div>
          {isSummary && (
            <div>
              {surveyData?.questions?.map((item: any, i: number) => (
                <>
                  <div>Q. {i + 1}</div>
                  <div>{item.text}</div>
                  {item?.questionType === 'SINGLE_CHOICE' &&
                    item?.choices?.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={item.choices}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="text" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                </>
              ))}
            </div>
          )}

          {!isSummary && (
            <>
              <Title title={`설문 참여 학생 (${students.length})`} />
              <StudentTable tableHead={['iD', '이름']} tableBody={students} />
            </>
          )}
        </div>
      </div>
    </>
  );
} 

export default SurveyTeacherDetailPage;