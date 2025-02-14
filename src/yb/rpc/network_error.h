// Copyright (c) YugaByte, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.  You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied.  See the License for the specific language governing permissions and limitations
// under the License.
//

#ifndef YB_RPC_NETWORK_ERROR_H
#define YB_RPC_NETWORK_ERROR_H

#include "yb/util/enums.h"
#include "yb/util/status_fwd.h"
#include "yb/util/status_ec.h"

namespace yb {
namespace rpc {

YB_DEFINE_ENUM(
    NetworkErrorCode,
    // Special value used to indicate no error of this type.
    (kNone)
    (kConnectFailed)
    );

struct NetworkErrorTag : IntegralErrorTag<NetworkErrorCode> {
  // This category id is part of the wire protocol and should not be changed once released.
  static constexpr uint8_t kCategory = 19;

  static std::string ToMessage(Value value) {
    return ToString(value);
  }
};

typedef StatusErrorCodeImpl<NetworkErrorTag> NetworkError;

} // namespace rpc
} // namespace yb

#endif // YB_RPC_NETWORK_ERROR_H
