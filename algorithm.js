class FirstFit {
  constructor(ramSize) {
    ramSize = parseInt(ramSize);
    this.ramSize = ramSize;
    this.ramUnused = [{ start: 0, end: ramSize }];
    this.ramUsed = [];
    this.processes = [];
    console.log('First Fit algorithm initialized');
  }

  /**
   * 分配内存
   * @param {number} pid
   * @returns {boolean} true if process was allocated, false otherwise
   */
  allocate(size) {
    // if size is string, string to number
    size = parseInt(size);
    if (size <= 0) {
      return false;
    }
    const block = this.ramUnused.sort((a, b) => a.start - b.start).find((block) => block.end - block.start >= size);
    if (block) {
      const index = this.ramUnused.indexOf(block);
      if (block.end - block.start > size) {
        this.ramUnused[index] = { start: block.start + size, end: block.end };
      } else {
        this.ramUnused.splice(index, 1);
      }
      // pid = max pid + 1 and should not depend this.processes is sorted,
      // use reduce to find max pid
      const pid = this.processes.reduce((max, process) => (process.pid > max ? process.pid : max), 0) + 1;
      this.ramUsed.push({ start: block.start, end: block.start + size, pid });
      this.processes.push({ pid, size });
      return true;
    }
    return false;
  }

  /**
   * 释放内存
   * @param {number} pid
   * @returns {boolean} true if process was freed, false otherwise
   */
  free(pid) {
    pid = parseInt(pid);
    const process = this.processes.find((process) => process.pid === pid);
    if (process) {
      const index = this.processes.indexOf(process);
      this.processes.splice(index, 1);
      const block = this.ramUsed.find((block) => block.pid === pid);
      const blockIndex = this.ramUsed.indexOf(block);
      this.ramUsed.splice(blockIndex, 1);
      block.pid = null;
      this.ramUnused.push(block);
      this.ramUnused.sort((a, b) => a.start - b.start);
      // 合并连续的内存
      for (let i = 0; i < this.ramUnused.length - 1; i++) {
        if (this.ramUnused[i].end === this.ramUnused[i + 1].start) {
          this.ramUnused[i].end = this.ramUnused[i + 1].end;
          this.ramUnused.splice(i + 1, 1);
          i--;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * 获取进程表
   * @returns {Array} 进程表
   * @example [{ pid: 1, size: 100 }, { pid: 2, size: 100 }]
   */
  getProcesses() {
    return this.processes;
  }

  /**
   * 获取内存分配情况
   * @returns {Array} 内存分配情况
   * @example
   * [
   *   { start: 0, end: 100, pid: 1 },
   *   { start: 100, end: 200, pid: 2 },
   *   { start: 200, end: 400, pid: null }
   * ]
   * pid 为 null 表示该内存块未被分配，否则为分配给进程的 pid，
   * start 和 end 为内存块的起始地址和结束地址，
   * 该数组应该按照 start 从小到大排序。
   */
  getDistributionStats() {
    const distribution = [...this.ramUnused, ...this.ramUsed];
    distribution.sort((a, b) => a.start - b.start);
    distribution.forEach((block) => {
      if (block.pid === undefined) {
        block.pid = null;
      }
    });
    return distribution;
  }

  /**
   *  获取内部碎片
   * @returns {Object} 内部碎片
   * @example
   * { requested: 95, allocated: 100 }
   */
  getInternalMemoryFragmentation() {
    const used = this.ramUsed.reduce((sum, block) => sum + block.end - block.start, 0);
    return { requested: used, allocated: used };
  }

  /**
   * 获取外部碎片
   * @returns {Object} 外部碎片
   * @example
   * { allocated: 55, total: 100 }
   */
  getExternalMemoryFragmentation() {
    const used = this.ramUsed.reduce((sum, block) => sum + block.end - block.start, 0);
    return { allocated: used, total: this.ramSize };
  }

  /**
   * 内存使用情况
   * @returns {Object} 内存使用情况
   * @example
   * { requested: 100, total: 100 }
   */
  getMemoryUsage() {
    const used = this.ramUsed.reduce((sum, block) => sum + block.end - block.start, 0);
    return { requested: used, total: this.ramSize };
  }
}

class WorstFit {
  constructor(ramSize) {
    ramSize = parseInt(ramSize);
    this.ramSize = ramSize;
    this.ramUnused = [{ start: 0, end: ramSize }];
    this.ramUsed = [];
    this.processes = [];
    console.log('First Fit algorithm initialized');
  }

  /**
   * 分配内存
   * @param {number} pid
   * @returns {boolean} true if process was allocated, false otherwise
   */
  allocate(size) {
    // if size is string, string to number
    size = parseInt(size);
    if (size <= 0) {
      return false;
    }
    const block = this.ramUnused
      .sort((a, b) => b.end - b.start - (a.end - a.start))
      .find((block) => block.end - block.start >= size);
    if (block) {
      const index = this.ramUnused.indexOf(block);
      if (block.end - block.start > size) {
        this.ramUnused[index] = { start: block.start + size, end: block.end };
      } else {
        this.ramUnused.splice(index, 1);
      }
      // pid = max pid + 1 and should not depend this.processes is sorted,
      // use reduce to find max pid
      const pid = this.processes.reduce((max, process) => (process.pid > max ? process.pid : max), 0) + 1;
      this.ramUsed.push({ start: block.start, end: block.start + size, pid });
      this.processes.push({ pid, size });
      return true;
    }
    return false;
  }

  /**
   * 释放内存
   * @param {number} pid
   * @returns {boolean} true if process was freed, false otherwise
   */
  free(pid) {
    pid = parseInt(pid);
    const process = this.processes.find((process) => process.pid === pid);
    if (process) {
      const index = this.processes.indexOf(process);
      this.processes.splice(index, 1);
      const block = this.ramUsed.find((block) => block.pid === pid);
      const blockIndex = this.ramUsed.indexOf(block);
      this.ramUsed.splice(blockIndex, 1);
      block.pid = null;
      this.ramUnused.push(block);
      this.ramUnused.sort((a, b) => a.start - b.start);
      // 合并连续的内存
      for (let i = 0; i < this.ramUnused.length - 1; i++) {
        if (this.ramUnused[i].end === this.ramUnused[i + 1].start) {
          this.ramUnused[i].end = this.ramUnused[i + 1].end;
          this.ramUnused.splice(i + 1, 1);
          i--;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * 获取进程表
   * @returns {Array} 进程表
   * @example [{ pid: 1, size: 100 }, { pid: 2, size: 100 }]
   */
  getProcesses() {
    return this.processes;
  }

  /**
   * 获取内存分配情况
   * @returns {Array} 内存分配情况
   * @example
   * [
   *   { start: 0, end: 100, pid: 1 },
   *   { start: 100, end: 200, pid: 2 },
   *   { start: 200, end: 400, pid: null }
   * ]
   * pid 为 null 表示该内存块未被分配，否则为分配给进程的 pid，
   * start 和 end 为内存块的起始地址和结束地址，
   * 该数组应该按照 start 从小到大排序。
   */
  getDistributionStats() {
    const distribution = [...this.ramUnused, ...this.ramUsed];
    distribution.sort((a, b) => a.start - b.start);
    distribution.forEach((block) => {
      if (block.pid === undefined) {
        block.pid = null;
      }
    });
    return distribution;
  }

  /**
   *  获取内部碎片
   * @returns {Object} 内部碎片
   * @example
   * { requested: 95, allocated: 100 }
   */
  getInternalMemoryFragmentation() {
    const used = this.ramUsed.reduce((sum, block) => sum + block.end - block.start, 0);
    return { requested: used, allocated: used };
  }

  /**
   * 获取外部碎片
   * @returns {Object} 外部碎片
   * @example
   * { allocated: 55, total: 100 }
   */
  getExternalMemoryFragmentation() {
    const used = this.ramUsed.reduce((sum, block) => sum + block.end - block.start, 0);
    return { allocated: used, total: this.ramSize };
  }

  /**
   * 内存使用情况
   * @returns {Object} 内存使用情况
   * @example
   * { requested: 100, total: 100 }
   */
  getMemoryUsage() {
    const used = this.ramUsed.reduce((sum, block) => sum + block.end - block.start, 0);
    return { requested: used, total: this.ramSize };
  }
}


class BestFit {
  constructor(ramSize) {
    ramSize = parseInt(ramSize);
    this.ramSize = ramSize;
    this.ramUnused = [{ start: 0, end: ramSize }];
    this.ramUsed = [];
    this.processes = [];
    console.log("Best Fit algorithm initialized");
  }

  /**
   * 分配内存
   * @param {number} pid
   * @returns {boolean} true if process was allocated, false otherwise
   */
  allocate(size) {
    // if size is string, string to number
    size = parseInt(size);
    if (size <= 0) {
      return false;
    }
    const blocks = this.ramUnused.filter(
      (block) => block.end - block.start >= size
    );
    if (blocks) {
      const block = blocks.reduce((min, block) =>
        block.end - block.start < min.end - min.start ? block : min
      );
      const index = this.ramUnused.indexOf(block);
      if (block.end - block.start > size) {
        this.ramUnused[index] = { start: block.start + size, end: block.end };
      } else {
        this.ramUnused.splice(index, 1);
      }
      // pid = max pid + 1 and should not depend this.processes is sorted,
      // use reduce to find max pid
      const pid =
        this.processes.reduce(
          (max, process) => (process.pid > max ? process.pid : max),
          0
        ) + 1;
      this.ramUsed.push({ start: block.start, end: block.start + size, pid });
      this.processes.push({ pid, size });
      return true;
    }
    return false;
  }

  /**
   * 释放内存
   * @param {number} pid
   * @returns {boolean} true if process was freed, false otherwise
   */
  free(pid) {
    pid = parseInt(pid);
    const process = this.processes.find((process) => process.pid === pid);
    if (process) {
      const index = this.processes.indexOf(process);
      this.processes.splice(index, 1);
      const block = this.ramUsed.find((block) => block.pid === pid);
      const blockIndex = this.ramUsed.indexOf(block);
      this.ramUsed.splice(blockIndex, 1);
      block.pid = null;
      this.ramUnused.push(block);
      this.ramUnused.sort((a, b) => a.start - b.start);
      // 合并连续的内存
      for (let i = 0; i < this.ramUnused.length - 1; i++) {
        if (this.ramUnused[i].end === this.ramUnused[i + 1].start) {
          this.ramUnused[i].end = this.ramUnused[i + 1].end;
          this.ramUnused.splice(i + 1, 1);
          i--;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * 获取进程表
   * @returns {Array} 进程表
   * @example [{ pid: 1, size: 100 }, { pid: 2, size: 100 }]
   */
  getProcesses() {
    return this.processes;
  }

  /**
   * 获取内存分配情况
   * @returns {Array} 内存分配情况
   * @example
   * [
   *   { start: 0, end: 100, pid: 1 },
   *   { start: 100, end: 200, pid: 2 },
   *   { start: 200, end: 400, pid: null }
   * ]
   * pid 为 null 表示该内存块未被分配，否则为分配给进程的 pid，
   * start 和 end 为内存块的起始地址和结束地址，
   * 该数组应该按照 start 从小到大排序。
   */
  getDistributionStats() {
    const distribution = [...this.ramUnused, ...this.ramUsed];
    distribution.sort((a, b) => a.start - b.start);
    distribution.forEach((block) => {
      if (block.pid === undefined) {
        block.pid = null;
      }
    });
    return distribution;
  }

  /**
   *  获取内部碎片
   * @returns {Object} 内部碎片
   * @example
   * { requested: 95, allocated: 100 }
   */
  getInternalMemoryFragmentation() {
    const used = this.ramUsed.reduce(
      (sum, block) => sum + block.end - block.start,
      0
    );
    return { requested: used, allocated: used };
  }

  /**
   * 获取外部碎片
   * @returns {Object} 外部碎片
   * @example
   * { allocated: 55, total: 100 }
   */
  getExternalMemoryFragmentation() {
    const used = this.ramUsed.reduce(
      (sum, block) => sum + block.end - block.start,
      0
    );
    return { allocated: used, total: this.ramSize };
  }

  /**
   * 内存使用情况
   * @returns {Object} 内存使用情况
   * @example
   * { requested: 100, total: 100 }
   */
  getMemoryUsage() {
    const used = this.ramUsed.reduce(
      (sum, block) => sum + block.end - block.start,
      0
    );
    return { requested: used, total: this.ramSize };
  }
}

class Paging {
  constructor(ramSize) {
    this.pageSize = 4;
    ramSize = parseInt((parseInt(ramSize) / this.pageSize)) * this.pageSize;
    this.ramSize = ramSize;
    this.pageCount = parseInt(ramSize / this.pageSize);
    this.sparePageCount = this.pageCount;
    this.pageTable = new Array(this.pageCount);
    this.pageTable.fill(0);
    this.requested = 0;
    this.processes = [];
    console.log("Paging algorithm initialized");
  }

  allocate(size) {
    // if size is string, string to number
    size = parseInt(size);
    if (size <= 0) {
      return false;
    }
    const pageNum = parseInt(size / this.pageSize) + ((size % this.pageSize) != 0);
    console.log((size % this.pageSize) == 1)
    console.log(pageNum)
    if (pageNum < this.sparePageCount) {
      this.requested += size;
      let n = pageNum;
      const pages = [];
      for (let i = 0; i < this.pageCount; i++) {
        if (!this.pageTable[i]) {
          this.pageTable[i] = 1;
          pages.push(i);
          n--;
        }
        if (n == 0) break;
      }
      this.sparePageCount -= pageNum;
      const pid =
        this.processes.reduce(
          (max, process) => (process.pid > max ? process.pid : max),
          0
        ) + 1;
      this.processes.push({
        pid,
        size: pageNum * this.pageSize,
        req: size,
        pages,
      });
      return true;
    }
    return false;
  }

  free(pid) {
    pid = parseInt(pid);
    const process = this.processes.find((process) => process.pid === pid);
    if (process) {
      const index = this.processes.indexOf(process);
      this.processes.splice(index, 1);
      process.pages.forEach((page) => (this.pageTable[page] = 0));
      this.sparePageCount += process.pages.length;
      this.requested -= process.req;
      return true;
    }
    return false;
  }

  /**
   * 获取进程表
   * @returns {Array} 进程表
   * @example [{ pid: 1, size: 100 }, { pid: 2, size: 100 }]
   */
  getProcesses() {
    return this.processes;
  }

  /**
   * 获取内存分配情况
   * @returns {Array} 内存分配情况
   * @example
   * [
   *   { start: 0, end: 100, pid: 1 },
   *   { start: 100, end: 200, pid: 2 },
   *   { start: 200, end: 400, pid: null }
   * ]
   * pid 为 null 表示该内存块未被分配，否则为分配给进程的 pid，
   * start 和 end 为内存块的起始地址和结束地址，
   * 该数组应该按照 start 从小到大排序。
   */
  getDistributionStats() {
    const distribution = [];
    this.pageTable.forEach((_, index) =>
      distribution.push({ start: index * 4, end: index * 4 + 4, pid: null })
    );
    this.processes.forEach((process) => {
      const pid = process.pid;
      process.pages.forEach((page) => {distribution[page].pid = pid});
    });
    //console.log(distribution);
    return distribution;
  }

  /**
   *  获取内部碎片
   * @returns {Object} 内部碎片
   * @example
   * { requested: 95, allocated: 100 }
   */
  getInternalMemoryFragmentation() {
    return {
      requested: this.requested,
      allocated: (this.pageCount - this.sparePageCount) * this.pageSize,
    };
  }

  /**
   * 获取外部碎片
   * @returns {Object} 外部碎片
   * @example
   * { allocated: 55, total: 100 }
   */
  getExternalMemoryFragmentation() {
    return {
      allocated: (this.pageCount - this.sparePageCount) * this.pageSize,
      total: this.ramSize,
    };
  }

  /**
   * 内存使用情况
   * @returns {Object} 内存使用情况
   * @example
   * { requested: 100, total: 100 }
   */
  getMemoryUsage() {
    return { requested: this.requested, total: this.ramSize };
  }
}