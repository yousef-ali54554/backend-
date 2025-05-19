import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // step-1 fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Step-2 If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
          progressPercentage: 0,
        },
      });
    }

    // Calculate progress percentage
    // Filter lectureProgress to only include lectures that still exist in the course
    const validLectureIds = courseDetails.lectures.map((l) =>
      l._id ? l._id.toString() : l.toString()
    );
    const filteredLectureProgress = courseProgress.lectureProgress.filter(
      (lecture) => validLectureIds.includes(lecture.lectureId.toString())
    );

    // Calculate completed lectures
    const completedLectures = filteredLectureProgress.filter(
      (lecture) => lecture.viewed
    ).length;
    const totalLectures = validLectureIds.length;
    const progressPercentage =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    // Step-3 Return the user's course progress along with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: filteredLectureProgress,
        completed: courseProgress.completed,
        progressPercentage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // find the lecture progress in the course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      // if lecture already exist, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // Add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // Get total lectures count
    const course = await Course.findById(courseId);
    const validLectureIds2 = course.lectures.map((l) =>
      l._id ? l._id.toString() : l.toString()
    );
    const completedLectures2 = courseProgress.lectureProgress.filter(
      (lectureProg) =>
        lectureProg.viewed &&
        validLectureIds2.includes(lectureProg.lectureId.toString())
    ).length;
    const totalLectures2 = validLectureIds2.length;
    // Calculate progress percentage
    const progressPercentage2 =
      totalLectures2 > 0
        ? Math.round((completedLectures2 / totalLectures2) * 100)
        : 0;
    // Update completion status
    courseProgress.completed =
      completedLectures2 === totalLectures2 && totalLectures2 > 0;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
      data: {
        completed: courseProgress.completed,
        progressPercentage: progressPercentage2,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as incompleted." });
  } catch (error) {
    console.log(error);
  }
};
