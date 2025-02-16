import { requestAPI } from '@/utils/fetch';

const getCoursePage = async (id: string) => {
  const { data } = await requestAPI().get(
    `/course/showCoursePage?courseId=${id}`
  );
  return data;
};

const getCourseSection = async (id: string) => {
  const { data } = await requestAPI().get(
    `/course/showCourseSection?courseId=${id}`
  );
  return data;
};

/**
 *
 * @param requestbody formData
 * @returns
 */
const insertNote = async (requestbody: any) => {
  const data = await requestAPI().post(
    `/note/write`,
    requestbody,
    'multipart/form-data'
  );
  return data;
};

const getCourseReferenceList = async (id: number) => {
  const { data } = await requestAPI().get(`/note/readList?courseId=${id}`);
  return data;
};

const getCourseReferenceDetail = async (id: number) => {
  const { data } = await requestAPI().get(`/note/read?noteId=${id}`);
  return data;
};

const deleteCourseReference = async (id: number) => {
  const data = await requestAPI().delete(`/note/delete?noteId=${id}`);
  return data;
};

const getCourseStudents = async (id: number) => {
  const data = await requestAPI().get(`/course/students?courseId=${id}`);
  return data;
};

const getCourseStudentsAwaiting = async (id: number) => {
  const data = await requestAPI().get(`/course/${id}/students/awaiting`);
  return data;
};
/**
 * 수강신청 승인,불허 api
 * @param courseId 
 * @param memberId 
 * @param action 
 * @returns 
 */
const StudentEnroll = async (
  courseId: number,
  memberId: number,
  action: boolean
) => {
  const { data } = await requestAPI().post(
    `/course/${courseId}/enroll/${memberId}?action=${action}`
  );
  return data;
};
/**
 * 성장기록부에 사용될 차시 리스트를 반환한다
 * @returns 
 */
const getShowCourseSection = async (courseId:number) => {
  const {data} = await requestAPI().get(`/course/showCourseSection?courseId=${courseId}`)
  return data
}

const courseAPIList = {
  getCoursePage,
  getCourseSection,
  insertNote,
  getCourseReferenceList,
  getCourseReferenceDetail,
  deleteCourseReference,
  getCourseStudents,
  getCourseStudentsAwaiting,
  StudentEnroll,
  getShowCourseSection
};

export default courseAPIList;
