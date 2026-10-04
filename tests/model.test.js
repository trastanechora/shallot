import test from 'node:test';
import assert from 'node:assert/strict';

test('six distinct stages show daughter formation before leaf growth and swelling', async () => {
 const { STAGES, stageModel } = await import('../src/data.js');
 assert.deepEqual(STAGES.map(s=>s.id), ['planting','sprouting','tillering','vegetative','bulbing','maturity']);
 assert.equal(stageModel('planting').count,1);
 assert.equal(stageModel('planting').leafLength,0);
 assert.ok(stageModel('maturity').count>1);
 assert.ok(stageModel('vegetative').leafLength>stageModel('sprouting').leafLength);
 assert.ok(stageModel('bulbing').bulbScale>stageModel('vegetative').bulbScale);
 assert.equal(stageModel('invalid'),stageModel('bulbing'));
});
