import React, { useState } from 'react';
import { Button, Space, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ViewQues from './ViewQues';
import EditQues from './EditQues';
import ViewExam from './ViewExam';
import EditExam from './EditExam';
import { Question, ExamData, QuesType, EDataDynamic, QDataDynamic } from '../../models/exam';
import { ExcoFetcher } from '../../utils/exco-fetcher';
import { Res } from '../../utils/common';

function validateEData(edata: EDataDynamic): Res {
    if (edata.title.trim().length === 0) {
        return Res.failure('Title cannot be empty');
    }
    if (edata.windowStart.getTime() > edata.windowEnd.getTime()) {
        return Res.failure('Start time cannot be after end time');
    }
    if (edata.duration < 0) {
        return Res.failure('Duration cannot be negative');
    }
    return Res.success();
}

function validateQues(ques: QDataDynamic): Res {
    if (ques.text.trim().length === 0) {
        return Res.failure('Question text cannot be empty');
    }
    if (ques.points <= 0) {
        return Res.failure('Invalid points');
    }
    if (!(ques.maxAttempts === -1 || ques.maxAttempts > 0)) {
        return Res.failure('Invalid max attempts');
    }
    if (ques.options.length === 0) {
        return Res.failure('Question must have at least one option');
    }
    if (ques.correct.length === 0) {
        return Res.failure('Question must have at least one correct option');
    }
    return Res.success();
}

const EditExamPage: React.FC<{ examData: ExamData }> = ({ examData }: { examData: ExamData }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [edata, setEdata] = useState<EDataDynamic>({
        title: examData.title,
        description: examData.description,
        windowStart: examData.windowStart,
        windowEnd: examData.windowEnd,
        duration: examData.duration,
        clampTime: examData.clampTime,
        showScores: examData.showScores,
        questions: examData.questions || []
    });
    const limitedEdit = examData.hasScripts;
    const [questions, setQuestions] = useState<Question[]>(examData.questions || []);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number>(-1);
    const [numQuestions, setNumQuestions] = useState<number>(1); // State for number of questions

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const uploadedQuestions = json.map((q: any) => new Question(
                    null,
                    q.questionText,
                    q.points,
                    q.maxAttempts,
                    q.questionType === "single" ? QuesType.RADIO : QuesType.CHECKBOX,
                    q.options,
                    [q.options.indexOf(q.correctAnswer)]
                ));
                const selectedQuestions = uploadedQuestions.slice(0, numQuestions); // Select the specified number of questions
                setQuestions(selectedQuestions);
                messageApi.success('Questions uploaded successfully');
            } catch (error) {
                messageApi.error('Failed to parse JSON file');
            }
        };
        reader.readAsText(file);
        return false;
    };

    const generateRandomQuiz = () => {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 20);
        setQuestions(selectedQuestions);
        messageApi.success('Random quiz generated successfully');
    };

    function addNewQues() {
        const qs = new Question(
            null, '', 1, 1,
            QuesType.RADIO, [], []
        );
        const qIndex = questions.length;
        setQuestions([...questions, qs]);
        setEditIndex(qIndex);
    }

    function editExisting(index: number) {
        setEditIndex(index);
    }

    function cancelEditing(index: number) {
        const ques = questions[index];
        if (ques._id === null) {
            setQuestions(questions.filter((_: any, i: number) => i !== index));
        }
        setEditIndex(-1);
    }

    function settleQues(index: number, ques: Question, id: string) {
        setQuestions(questions.map((q: any, i: number) => {
            if (i === index) {
                ques._id = id;
                return ques;
            } else {
                return q;
            }
        }));
    }

    function removeQues(index: number) {
        setQuestions(questions.filter((_: any, i: number) => i !== index));
    }

    function canEditNow() {
        return editIndex === -1;
    }

    const canEdit = canEditNow();

    function updateExamData(newData: EDataDynamic, setSpinner?: (loading: boolean) => void) {
        const _val = validateEData(newData);
        if (!_val.ok()) {
            messageApi.error(_val.msg);
            return;
        }

        setSpinner?.(true);

        new ExcoFetcher()
            .needAuth()
            .patch(`api/exam/${examData.examID}`)
            .body(newData)
            .failure(err => messageApi.error(err))
            .error(err => messageApi.error(err))
            .success(() => {
                messageApi.success('Exam updated successfully');
                setEdata({ ...newData });
            })
            .finally(() => setSpinner?.(false))
            .exec();
    }

    function deleteExam(setSpinner?: (loading: boolean) => void) {
        setSpinner?.(true);

        new ExcoFetcher()
            .needAuth()
            .delete(`api/exam/${examData.examID}`)
            .failure(err => messageApi.error(err))
            .error(err => messageApi.error(err))
            .success(() => messageApi.success('Exam deleted successfully'))
            .finally(() => setSpinner?.(false))
            .exec();
    }

    function saveQues(index: number, quesID: string | null, quesData: QDataDynamic, setSpinner?: (loading: boolean) => void) {
        const _val = validateQues(quesData);
        if (!_val.ok()) {
            messageApi.error(_val.msg);
            return;
        }

        const isNew = quesID === null;

        const exf = new ExcoFetcher()
            .needAuth()
            .failure(err => messageApi.error(err))
            .error(err => messageApi.error(err))
            .finally(() => setSpinner?.(false))
            .body(quesData);

        if (isNew) {
            exf
                .post(`api/exam/${examData.examID}/ques`)
                .success(res => {
                    messageApi.success('Question added successfully');
                    settleQues(index, {
                        ...quesData, _id: res,
                        type: undefined
                    }, res);
                    setEditIndex(-1);
                });
        } else {
            exf
                .patch(`api/exam/${examData.examID}/ques/${quesID}`)
                .success(() => {
                    messageApi.success('Question updated successfully');
                    settleQues(index, {
                        ...quesData, _id: quesID,
                        type: undefined
                    }, quesID);
                    setEditIndex(-1);
                });
        }

        setSpinner?.(true);
        exf.exec();
    }

    function deleteQues(index: number, quesID: string, setSpinner?: (loading: boolean) => void) {
        setSpinner?.(true);

        new ExcoFetcher()
            .needAuth()
            .delete(`api/exam/${examData.examID}/ques/${quesID}`)
            .failure(err => messageApi.error(err))
            .error(err => messageApi.error(err))
            .success(() => {
                messageApi.success('Question deleted successfully');
                removeQues(index);
            })
            .finally(() => setSpinner?.(false))
            .exec();
    }

    return (
        <>
            {contextHolder}
            <Button onClick={() => setShowEditor(!showEditor)} style={{ margin: '10px 5px' }}>{showEditor ? 'Hide Editor' : 'Show Editor'}</Button>
            {
                showEditor ? (
                    <EditExam
                        examID={examData.examID}
                        madeBy={examData.madeBy}
                        title={edata.title}
                        description={edata.description}
                        windowStart={edata.windowStart}
                        windowEnd={edata.windowEnd}
                        duration={edata.duration}
                        clampTime={edata.clampTime}
                        showScores={edata.showScores}
                        onSave={updateExamData}
                        onDelete={deleteExam}
                    />
                ) : (
                    <ViewExam
                        examID={examData.examID}
                        madeBy={examData.madeBy}
                        title={edata.title}
                        description={edata.description}
                        windowStart={edata.windowStart}
                        windowEnd={edata.windowEnd}
                        duration={edata.duration}
                        clampTime={edata.clampTime}
                        showScores={edata.showScores}
                        state={examData.state}
                        limitedEdit={limitedEdit}
                    />
                )
            }
            <Space direction="vertical" size="middle" style={{ display: 'flex', margin: '20px 0px', width: '100%' }}>
                <Upload beforeUpload={handleUpload} accept=".json">
                    <Button icon={<UploadOutlined />}>Upload Questions JSON</Button>
                </Upload>
                <Select defaultValue={1} style={{ width: 120 }} onChange={setNumQuestions}>
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                        <Select.Option key={num} value={num}>{num}</Select.Option>
                    ))}
                </Select>
                <Button onClick={generateRandomQuiz}>Generate Random Quiz</Button>
                {
                    questions.map((ques: { _id: string | null; text: any; points: any; maxAttempts: any; quesType: any; options: any; correct: any; }, i: number) => (
                        (editIndex === i) ? (
                            <EditQues
                                key={i}
                                index={i}
                                quesID={ques._id}
                                text={ques.text}
                                points={ques.points}
                                maxAttempts={ques.maxAttempts}
                                quesType={ques.quesType}
                                options={ques.options}
                                correct={ques.correct}
                                onEditClose={() => cancelEditing(i)}
                                onEditSave={(quesData: QDataDynamic, setSpinner: ((loading: boolean) => void) | undefined) => saveQues(i, ques._id, quesData, setSpinner)}
                                limitedEdit={limitedEdit}
                            />
                        ) : (
                            <ViewQues
                                key={i}
                                index={i}
                                text={ques.text}
                                points={ques.points}
                                maxAttempts={ques.maxAttempts}
                                quesType={ques.quesType}
                                options={ques.options}
                                state={examData.state}
                                hasScores={examData.showScores}
                                correct={ques.correct}
                                canEdit={canEdit}
                                onGotoEdit={() => editExisting(i)}
                                onDelete={(setSpinner: ((loading: boolean) => void) | undefined) => deleteQues(i, ques._id as string, setSpinner)}
                                limitedEdit={limitedEdit}
                            />
                        )
                    ))
                }
                <Button type="dashed" style={{ height: '48px' }} disabled={!canEdit || limitedEdit} onClick={addNewQues} block>Add Question</Button>
            </Space>
        </>
    );
};

export default EditExamPage;