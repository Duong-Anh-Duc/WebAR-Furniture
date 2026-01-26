import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

/**
 * Kiểm tra Blender có tồn tại không
 */
function isBlenderAvailable(blenderBin: string): boolean {
  // Nếu user tuyên bố SKIP_BLENDER_CONVERSION, skip
  if (process.env.SKIP_BLENDER_CONVERSION === 'true') {
    return false;
  }

  // Kiểm tra xem file/executable có tồn tại không
  try {
    if (fs.existsSync(blenderBin)) {
      return true;
    }
  } catch (e) {
    // Ignore
  }

  // Nếu BLENDER_BIN được đặt tường minh, giả sử user biết nó ở đâu
  if (process.env.BLENDER_BIN) {
    return true;
  }

  return false;
}

/**
 * Convert GLB to USDZ using Blender headless
 * Requires Blender to be installed and BLENDER_BIN env var set
 * Returns false if Blender not available (caller should use fallback)
 */
export async function convertGlbToUsdz(glbPath: string, usdzPath: string): Promise<boolean> {
  // Blender executable path
  const blenderBin = process.env.BLENDER_BIN || 'blender';
  const scriptPath = path.join(process.cwd(), 'scripts', 'glb_to_usdz.py');

  // Verify inputs
  if (!fs.existsSync(glbPath)) {
    throw new Error(`GLB file not found: ${glbPath}`);
  }

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Conversion script not found: ${scriptPath}`);
  }

  // Kiểm tra Blender có sẵn không
  if (!isBlenderAvailable(blenderBin)) {
    logger.warn('Blender not available, will use fallback method', { blenderBin });
    return false;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(usdzPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    logger.info('Starting GLB to USDZ conversion with Blender', { glbPath, usdzPath, blenderBin });

    // Spawn Blender process
    const process = spawn(
      blenderBin,
      [
        '-b', // Batch mode (headless)
        '--factory-startup', // Use factory settings
        '--python', scriptPath, // Run Python script
        '--', // Separator for script arguments
        glbPath, // Input GLB path
        usdzPath, // Output USDZ path
      ],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 60000, // 60 second timeout
      }
    );

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0 && fs.existsSync(usdzPath)) {
        const fileSize = fs.statSync(usdzPath).size;
        logger.info('GLB to USDZ conversion successful', {
          glbPath,
          usdzPath,
          fileSize,
          stdout,
        });
        resolve(true);
      } else {
        const error = `Blender conversion failed (code=${code})\nStdout:\n${stdout}\nStderr:\n${stderr}`;
        logger.error('GLB to USDZ conversion failed', {
          glbPath,
          usdzPath,
          code,
          stdout,
          stderr,
        });
        resolve(false); // Return false instead of reject to trigger fallback
      }
    });

    process.on('error', (error) => {
      logger.warn('Failed to spawn Blender process', {
        blenderBin,
        error: error.message,
      });
      resolve(false); // Return false instead of reject to trigger fallback
    });
  });
}
