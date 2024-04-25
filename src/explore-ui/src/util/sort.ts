export const sortImagesBySubjectRecognition = (images: any[], sort?: { sortBy: string, dir: string }): unknown[] => {
    const recognized = images.map(i => i.faces.recognized.map((r: { [key: string]: any }) => ({
        subjectId: r.subject_id,
        similarity: r.subject.similarity,
        originalJsonFile: i.jsonFile,
        fullImage: i.exif.SourceFile,
        image: r.image,
        age: r.age
    }))).flat();

    const sorted = recognized.reduce((acc, cur, i) => {
        if (!acc) acc = {};
        if (acc[cur.subjectId]) {
            acc[cur.subjectId].push(cur);
        } else {
            acc[cur.subjectId] = [cur]
        }

        if (sort && sort.sortBy && sort.dir) {
            const ascending = (a: any, b: any) => a[sort.sortBy] - b[sort.sortBy]
            const descending = (a: any, b: any) => b[sort.sortBy] - a[sort.sortBy]
            const operator = sort.dir === 'asc' ? ascending : descending;
            acc[cur.subjectId] = acc[cur.subjectId].sort(operator)
        }
        return acc;
    }, {});

    return sorted
}