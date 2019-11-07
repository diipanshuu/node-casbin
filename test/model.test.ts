// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as _ from 'lodash';
import { newEnforcer, Enforcer, newModel } from '../src';

async function testEnforce(e: Enforcer, sub: string, obj: any, act: string, res: boolean): Promise<void> {
  await expect(e.enforce(sub, obj, act)).resolves.toBe(res);
}

async function testEnforceWithoutUsers(e: Enforcer, obj: string, act: string, res: boolean): Promise<void> {
  await expect(e.enforce(obj, act)).resolves.toBe(res);
}

async function testDomainEnforce(e: Enforcer, sub: string, dom: string, obj: string, act: string, res: boolean): Promise<void> {
  await expect(e.enforce(sub, dom, obj, act)).resolves.toBe(res);
}

test('TestBasicModel', async () => {
  const e = await newEnforcer('examples/basic_model.conf', 'examples/basic_policy.csv');

  await testEnforce(e, 'alice', 'data1', 'read', true);
  await testEnforce(e, 'alice', 'data1', 'write', false);
  await testEnforce(e, 'alice', 'data2', 'read', false);
  await testEnforce(e, 'alice', 'data2', 'write', false);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', false);
  await testEnforce(e, 'bob', 'data2', 'write', true);
});

test('TestBasicModelNoPolicy', async () => {
  const e = await newEnforcer('examples/basic_model.conf');

  await testEnforce(e, 'alice', 'data1', 'read', false);
  await testEnforce(e, 'alice', 'data1', 'write', false);
  await testEnforce(e, 'alice', 'data2', 'read', false);
  await testEnforce(e, 'alice', 'data2', 'write', false);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', false);
  await testEnforce(e, 'bob', 'data2', 'write', false);
});

test('TestBasicModelWithRoot', async () => {
  const e = await newEnforcer('examples/basic_with_root_model.conf', 'examples/basic_policy.csv');

  await testEnforce(e, 'alice', 'data1', 'read', true);
  await testEnforce(e, 'alice', 'data1', 'write', false);
  await testEnforce(e, 'alice', 'data2', 'read', false);
  await testEnforce(e, 'alice', 'data2', 'write', false);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', false);
  await testEnforce(e, 'bob', 'data2', 'write', true);
  await testEnforce(e, 'root', 'data1', 'read', true);
  await testEnforce(e, 'root', 'data1', 'write', true);
  await testEnforce(e, 'root', 'data2', 'read', true);
  await testEnforce(e, 'root', 'data2', 'write', true);
});

test('TestBasicModelWithRootNoPolicy', async () => {
  const e = await newEnforcer('examples/basic_with_root_model.conf');

  await testEnforce(e, 'alice', 'data1', 'read', false);
  await testEnforce(e, 'alice', 'data1', 'write', false);
  await testEnforce(e, 'alice', 'data2', 'read', false);
  await testEnforce(e, 'alice', 'data2', 'write', false);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', false);
  await testEnforce(e, 'bob', 'data2', 'write', false);
  await testEnforce(e, 'root', 'data1', 'read', true);
  await testEnforce(e, 'root', 'data1', 'write', true);
  await testEnforce(e, 'root', 'data2', 'read', true);
  await testEnforce(e, 'root', 'data2', 'write', true);
});

test('TestBasicModelWithoutUsers', async () => {
  const e = await newEnforcer('examples/basic_without_users_model.conf', 'examples/basic_without_users_policy.csv');

  await testEnforceWithoutUsers(e, 'data1', 'read', true);
  await testEnforceWithoutUsers(e, 'data1', 'write', false);
  await testEnforceWithoutUsers(e, 'data2', 'read', false);
  await testEnforceWithoutUsers(e, 'data2', 'write', true);
});

test('TestBasicModelWithoutResources', async () => {
  const e = await newEnforcer('examples/basic_without_resources_model.conf', 'examples/basic_without_resources_policy.csv');
  e.initialize();

  await testEnforceWithoutUsers(e, 'alice', 'read', true);
  await testEnforceWithoutUsers(e, 'alice', 'write', false);
  await testEnforceWithoutUsers(e, 'bob', 'read', false);
  await testEnforceWithoutUsers(e, 'bob', 'write', true);
});

test('TestRBACModel', async () => {
  const e = await newEnforcer('examples/rbac_model.conf', 'examples/rbac_policy.csv');

  await testEnforce(e, 'alice', 'data1', 'read', true);
  await testEnforce(e, 'alice', 'data1', 'write', false);
  await testEnforce(e, 'alice', 'data2', 'read', true);
  await testEnforce(e, 'alice', 'data2', 'write', true);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', false);
  await testEnforce(e, 'bob', 'data2', 'write', true);
});

test('TestRBACModelWithResourceRoles', async () => {
  const e = await newEnforcer('examples/rbac_with_resource_roles_model.conf', 'examples/rbac_with_resource_roles_policy.csv');

  await testEnforce(e, 'alice', 'data1', 'read', true);
  await testEnforce(e, 'alice', 'data1', 'write', true);
  await testEnforce(e, 'alice', 'data2', 'read', false);
  await testEnforce(e, 'alice', 'data2', 'write', true);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', false);
  await testEnforce(e, 'bob', 'data2', 'write', true);
});

test('TestRBACModelWithDomains', async () => {
  const e = await newEnforcer('examples/rbac_with_domains_model.conf', 'examples/rbac_with_domains_policy.csv');

  await testDomainEnforce(e, 'alice', 'domain1', 'data1', 'read', true);
  await testDomainEnforce(e, 'alice', 'domain1', 'data1', 'write', true);
  await testDomainEnforce(e, 'alice', 'domain1', 'data2', 'read', false);
  await testDomainEnforce(e, 'alice', 'domain1', 'data2', 'write', false);
  await testDomainEnforce(e, 'bob', 'domain2', 'data1', 'read', false);
  await testDomainEnforce(e, 'bob', 'domain2', 'data1', 'write', false);
  await testDomainEnforce(e, 'bob', 'domain2', 'data2', 'read', true);
  await testDomainEnforce(e, 'bob', 'domain2', 'data2', 'write', true);
});

class TestResource {
  public Name: string;
  public Owner: string;

  constructor(name: string, owner: string) {
    this.Name = name;
    this.Owner = owner;
  }
}

test('TestABACModel', async () => {
  const e = await newEnforcer('examples/abac_model.conf');

  const data1 = new TestResource('data1', 'alice');
  const data2 = new TestResource('data2', 'bob');

  await testEnforce(e, 'alice', data1, 'read', true);
  await testEnforce(e, 'alice', data1, 'write', true);
  await testEnforce(e, 'alice', data2, 'read', false);
  await testEnforce(e, 'alice', data2, 'write', false);
  await testEnforce(e, 'bob', data1, 'read', false);
  await testEnforce(e, 'bob', data1, 'write', false);
  await testEnforce(e, 'bob', data2, 'read', true);
  await testEnforce(e, 'bob', data2, 'write', true);
});

test('TestKeyMatchModel', async () => {
  const e = await newEnforcer('examples/keymatch_model.conf', 'examples/keymatch_policy.csv');

  await testEnforce(e, 'alice', '/alice_data/resource1', 'GET', true);
  await testEnforce(e, 'alice', '/alice_data/resource1', 'POST', true);
  await testEnforce(e, 'alice', '/alice_data/resource2', 'GET', true);
  await testEnforce(e, 'alice', '/alice_data/resource2', 'POST', false);
  await testEnforce(e, 'alice', '/bob_data/resource1', 'GET', false);
  await testEnforce(e, 'alice', '/bob_data/resource1', 'POST', false);
  await testEnforce(e, 'alice', '/bob_data/resource2', 'GET', false);
  await testEnforce(e, 'alice', '/bob_data/resource2', 'POST', false);

  await testEnforce(e, 'bob', '/alice_data/resource1', 'GET', false);
  await testEnforce(e, 'bob', '/alice_data/resource1', 'POST', false);
  await testEnforce(e, 'bob', '/alice_data/resource2', 'GET', true);
  await testEnforce(e, 'bob', '/alice_data/resource2', 'POST', false);
  await testEnforce(e, 'bob', '/bob_data/resource1', 'GET', false);
  await testEnforce(e, 'bob', '/bob_data/resource1', 'POST', true);
  await testEnforce(e, 'bob', '/bob_data/resource2', 'GET', false);
  await testEnforce(e, 'bob', '/bob_data/resource2', 'POST', true);

  await testEnforce(e, 'cathy', '/cathy_data', 'GET', true);
  await testEnforce(e, 'cathy', '/cathy_data', 'POST', true);
  await testEnforce(e, 'cathy', '/cathy_data', 'DELETE', false);
});

test('TestKeyMatch2Model', async () => {
  const e = await newEnforcer('examples/keymatch2_model.conf', 'examples/keymatch2_policy.csv');

  await testEnforce(e, 'alice', '/alice_data', 'GET', false);
  await testEnforce(e, 'alice', '/alice_data/resource1', 'GET', true);
  await testEnforce(e, 'alice', '/alice_data2/myid', 'GET', false);
  await testEnforce(e, 'alice', '/alice_data2/myid/using/res_id', 'GET', true);
});

function customFunction(key1: string, key2: string): boolean {
  if (key1 === '/alice_data2/myid/using/res_id' && key2 === '/alice_data/:resource') {
    return true;
  } else if (key1 === '/alice_data2/myid/using/res_id' && key2 === '/alice_data2/:id/using/:resId') {
    return true;
  } else {
    return false;
  }
}

function customFunctionWrapper(...args: any[]): boolean {
  const name1: string = _.toString(args[0]);
  const name2: string = _.toString(args[1]);

  return customFunction(name1, name2);
}

test('TestKeyMatchCustomModel', async () => {
  const e = await newEnforcer('examples/keymatch_custom_model.conf', 'examples/keymatch2_policy.csv');

  e.addFunction('keyMatchCustom', customFunctionWrapper);

  await testEnforce(e, 'alice', '/alice_data2/myid', 'GET', false);
  await testEnforce(e, 'alice', '/alice_data2/myid/using/res_id', 'GET', true);
});

test('TestIPMatchModel', async () => {
  const e = await newEnforcer('examples/ipmatch_model.conf', 'examples/ipmatch_policy.csv');

  await testEnforce(e, '192.168.2.123', 'data1', 'read', true);
  await testEnforce(e, '192.168.2.123', 'data1', 'write', false);
  await testEnforce(e, '192.168.2.123', 'data2', 'read', false);
  await testEnforce(e, '192.168.2.123', 'data2', 'write', false);

  await testEnforce(e, '192.168.0.123', 'data1', 'read', false);
  await testEnforce(e, '192.168.0.123', 'data1', 'write', false);
  await testEnforce(e, '192.168.0.123', 'data2', 'read', false);
  await testEnforce(e, '192.168.0.123', 'data2', 'write', false);

  await testEnforce(e, '10.0.0.5', 'data1', 'read', false);
  await testEnforce(e, '10.0.0.5', 'data1', 'write', false);
  await testEnforce(e, '10.0.0.5', 'data2', 'read', false);
  await testEnforce(e, '10.0.0.5', 'data2', 'write', true);

  await testEnforce(e, '192.168.0.1', 'data1', 'read', false);
  await testEnforce(e, '192.168.0.1', 'data1', 'write', false);
  await testEnforce(e, '192.168.0.1', 'data2', 'read', false);
  await testEnforce(e, '192.168.0.1', 'data2', 'write', false);
});

test('TestPriorityModel', async () => {
  const e = await newEnforcer('examples/priority_model.conf', 'examples/priority_policy.csv');

  await testEnforce(e, 'alice', 'data1', 'read', true);
  await testEnforce(e, 'alice', 'data1', 'write', false);
  await testEnforce(e, 'alice', 'data2', 'read', false);
  await testEnforce(e, 'alice', 'data2', 'write', false);
  await testEnforce(e, 'bob', 'data1', 'read', false);
  await testEnforce(e, 'bob', 'data1', 'write', false);
  await testEnforce(e, 'bob', 'data2', 'read', true);
  await testEnforce(e, 'bob', 'data2', 'write', false);
});

test('TestPriorityModelIndeterminate', async () => {
  const e = await newEnforcer('examples/priority_model.conf', 'examples/priority_indeterminate_policy.csv');

  await testEnforce(e, 'alice', 'data1', 'read', false);
});

test('TestMatcher', async () => {
  const m = newModel();

  m.addDef('m', 'm', 'keyMatch(r.obj, ".*get$") || regexMatch(r.act, ".user.")');

  // TODO Typescript 3.7 is not supported by prettier
  // eslint-disable-next-line prettier/prettier
  expect(m.model.get('m')?.get('m')?.value).toEqual(`keyMatch(r_obj, ".*get$") || regexMatch(r_act, ".user.")`);
});
