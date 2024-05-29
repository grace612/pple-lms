import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import { useRouter } from '@/hooks/useRouter';
import courseAPIList from '@/services/course';
import useCourseNameStore from '@/stores/useCourseName';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from "./index.module.scss"
const CourseDetailPage = () => {
  const {state} = useLocation()
  const router = useRouter();
  const { setTitle } = useCourseNameStore();
  const onPushAttendPage = () => {
    router.push('/attendance', {} ,{state})
  }

  // 해당 과목 공지사항 및 과목명 반환
  const getCourseDatas = async () => {
    try {
      const res = await courseAPIList.getCoursePage(state.id);
      console.log(res);
      setTitle(res.courseName);
    } catch (error) {
      
    }
  }

  // 해당 과목 차시 데이터 생성
  const getCourseSection = async () => {
    const res = await courseAPIList.getCourseSection(state.id)
    
  }

  

  useEffect(() => {
    getCourseDatas();
    getCourseSection()
  },[])

  return (
    <div>
      <Card title="강좌 공지사항" emptyMsg="등록된 공지사항이 없습니다" />
      <Button
        buttonType="Active"
        onClick={onPushAttendPage}
        className={styles.AttendButton}
      >
        출석정보확인
      </Button>
    </div>
  );
}

export default CourseDetailPage;