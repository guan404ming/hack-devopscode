import fs from 'fs'

try {
  const jsonString = fs.readFileSync('test-results/test-results.json')
  const jsonObject = JSON.parse(jsonString)

  const tests = jsonObject.suites
    .map(suite =>
      suite.specs.map(spec => {
        const match = spec.title.match(/^(\d+\.\d+) (.*) \((\d+)%\)$/)
        const status = spec.tests[0].results[0].status
        return {
          score: status === 'passed' ? parseInt(match[3], 10) : 0,
          max_score: parseInt(match[3], 10),
          status,
          name: match[2],
          name_format: 'text',
          number: match[1],
          ...(spec.tests[0].results[0].error?.snippet && {
            output: spec.tests[0].results[0].error.snippet,
            output_format: 'ansi',
          }),
          visibility: 'visible',
          extra_data: {
            duration: spec.tests[0].results[0].duration,
            ...(spec.tests[0].results[0].error && {
              error_message: spec.tests[0].results[0].error.stack.split('\n')[0],
              ...(spec.tests[0].results[0].error.location && {
                error_path: `${spec.tests[0].results[0].error.location.file.split('/tests/')[1]}:${spec.tests[0].results[0].error.location.line}:${
                  spec.tests[0].results[0].error.location.column
                }`,
              }),
              ...(spec.tests[0].results[0].error.snippet && {
                error_snippet: spec.tests[0].results[0].error.snippet,
              }),
            }),
          },
        }
      })
    )
    .flat()

  const totalScore = tests.reduce((acc, test) => acc + test.score, 0)

  const leaderboard = [{ name: 'score', value: totalScore, order: 'desc' }]

  console.log(
    JSON.stringify({
      tests,
      leaderboard,
      visibility: 'visible',
      // stdout_visibility: 'visible',
    })
  )
} catch (err) {
  console.error('Error:', err)
}
